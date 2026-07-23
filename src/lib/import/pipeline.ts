import "server-only";
import { randomUUID } from "crypto";
import { safeFetchHtml, validateImportUrl } from "@/lib/security/safe-fetch";
import { extractProductData, type RawExtraction } from "./extract";
import { translateAndStructureProduct, type ProductDraft } from "./translate";
import { runCrawlAndGetItems } from "@/lib/apify-client";
import { readCollection, writeCollection } from "@/lib/store/json-store";

export type ImportJobRecord = {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  urlKind: "product" | "category";
  status: "queued" | "extracting" | "translating" | "review" | "published" | "rejected" | "failed";
  crawlMethod?: "direct-fetch" | "apify";
  draft?: ProductDraft;
  errorMessage?: string;
  createdBy: string;
  createdAt: string;
  model?: string;
  tokenUsage?: number;
  estimatedCostUsd?: number;
};

const JOBS_COLLECTION = "import-jobs";

// Rough gpt-4o-mini pricing for the cost estimate shown in the admin UI.
const USD_PER_1K_PROMPT_TOKENS = 0.00015;
const USD_PER_1K_COMPLETION_TOKENS = 0.0006;

export async function listImportJobs(): Promise<ImportJobRecord[]> {
  return readCollection<ImportJobRecord[]>(JOBS_COLLECTION, []);
}

async function saveJob(job: ImportJobRecord): Promise<void> {
  const jobs = await listImportJobs();
  const index = jobs.findIndex((j) => j.id === job.id);
  if (index === -1) jobs.unshift(job);
  else jobs[index] = job;
  await writeCollection(JOBS_COLLECTION, jobs);
}

/** Decathlon and most storefronts use "/p/" in single-product URLs; anything else is treated as a listing/category page. */
function isLikelyProductUrl(url: URL): boolean {
  return /\/p\//i.test(url.pathname) || /-p-\d+/i.test(url.pathname);
}

function looksLikeUsableExtraction(extraction: RawExtraction): boolean {
  return Boolean(extraction.title) && (Boolean(extraction.priceAmount) || (extraction.description?.length ?? 0) > 40);
}

async function extractViaApify(url: URL, maxPages: number): Promise<RawExtraction[]> {
  const items = await runCrawlAndGetItems([url.toString()], { maxCrawlPages: maxPages });
  return items
    .map((item) => normalizeApifyItem(item))
    .filter((extraction): extraction is RawExtraction => extraction !== null);
}

/**
 * Apify's website-content-crawler returns { url, title, description/text/markdown, metadata }.
 * This is defensive about exact field naming since it can't be verified against a live
 * response from this sandbox (api.apify.com is unreachable here).
 */
function normalizeApifyItem(item: unknown): RawExtraction | null {
  if (typeof item !== "object" || item === null) return null;
  const record = item as Record<string, unknown>;
  const title = (record.title as string) ?? (record.metadata as Record<string, unknown>)?.title;
  const bodyText = (record.text as string) ?? (record.markdown as string) ?? "";
  if (!title && !bodyText) return null;

  return {
    title: typeof title === "string" ? title : undefined,
    description: (record.description as string) ?? undefined,
    images: Array.isArray(record.images) ? (record.images as string[]).slice(0, 6) : [],
    priceAmount: undefined,
    priceCurrency: undefined,
    brand: undefined,
    sku: undefined,
    availability: undefined,
    bodyTextSample: String(bodyText).slice(0, 6000),
  };
}

export async function runImportJob(sourceUrl: string, createdBy: string): Promise<ImportJobRecord[]> {
  const url = validateImportUrl(sourceUrl);
  const urlKind: "product" | "category" = isLikelyProductUrl(url) ? "product" : "category";

  const baseJob: ImportJobRecord = {
    id: randomUUID(),
    sourceUrl: url.toString(),
    sourceDomain: url.hostname,
    urlKind,
    status: "queued",
    createdBy,
    createdAt: new Date().toISOString(),
  };
  await saveJob(baseJob);

  try {
    baseJob.status = "extracting";
    await saveJob(baseJob);

    let extractions: RawExtraction[] = [];
    let crawlMethod: "direct-fetch" | "apify" = "direct-fetch";

    if (urlKind === "product") {
      try {
        const { html } = await safeFetchHtml(url.toString());
        const direct = extractProductData(html);
        if (looksLikeUsableExtraction(direct)) {
          extractions = [direct];
        }
      } catch {
        // fall through to Apify below
      }
      if (extractions.length === 0) {
        crawlMethod = "apify";
        extractions = await extractViaApify(url, 1);
      }
    } else {
      crawlMethod = "apify";
      extractions = await extractViaApify(url, 15);
    }

    if (extractions.length === 0) {
      throw new Error("هیچ محصولی از این آدرس استخراج نشد.");
    }

    baseJob.crawlMethod = crawlMethod;
    baseJob.status = "translating";
    await saveJob(baseJob);

    // Product URL -> one job with one draft. Category URL -> one job per discovered product,
    // so each still goes through its own human-review step before publishing.
    const jobsOut: ImportJobRecord[] = [];
    for (const extraction of extractions) {
      const job: ImportJobRecord =
        extraction === extractions[0]
          ? baseJob
          : { ...baseJob, id: randomUUID() };

      try {
        const { draft, model, promptTokens, completionTokens } = await translateAndStructureProduct(
          url.toString(),
          extraction
        );
        job.draft = draft;
        job.model = model;
        job.tokenUsage = promptTokens + completionTokens;
        job.estimatedCostUsd =
          (promptTokens / 1000) * USD_PER_1K_PROMPT_TOKENS + (completionTokens / 1000) * USD_PER_1K_COMPLETION_TOKENS;
        job.status = "review";
      } catch (error) {
        job.status = "failed";
        job.errorMessage = error instanceof Error ? error.message : "خطای ناشناخته در ترجمه.";
      }
      await saveJob(job);
      jobsOut.push(job);
    }

    return jobsOut;
  } catch (error) {
    baseJob.status = "failed";
    baseJob.errorMessage = error instanceof Error ? error.message : "خطای ناشناخته.";
    await saveJob(baseJob);
    return [baseJob];
  }
}

export async function rejectImportJob(jobId: string): Promise<void> {
  const jobs = await listImportJobs();
  const job = jobs.find((j) => j.id === jobId);
  if (job) {
    job.status = "rejected";
    await writeCollection(JOBS_COLLECTION, jobs);
  }
}

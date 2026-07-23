import "server-only";
import { randomUUID } from "crypto";
import { readCollection, writeCollection } from "@/lib/store/json-store";
import { listImportJobs, type ImportJobRecord } from "./pipeline";
import { getLatestFxRates } from "@/lib/fx/bonbast";
import type { AdminProduct } from "@/lib/admin-types";

const PUBLISHED_COLLECTION = "imported-products";

export async function listImportedProducts(): Promise<AdminProduct[]> {
  return readCollection<AdminProduct[]>(PUBLISHED_COLLECTION, []);
}

function toJalaliPlaceholder(): string {
  // Real Jalali conversion belongs with a date library once this is wired
  // to a database; showing the Gregorian date here rather than faking one.
  return new Date().toISOString().slice(0, 10);
}

async function convertToToman(amount: number, currency: string): Promise<{ toman: number; note?: string }> {
  const snapshot = await getLatestFxRates();
  const rate = snapshot?.rates[currency.toUpperCase()];
  if (!rate) {
    return { toman: 0, note: `نرخ ارز ${currency} موجود نیست — قیمت باید دستی وارد شود.` };
  }
  const rial = amount * rate.sell;
  return { toman: Math.round(rial / 10) };
}

/**
 * Converts an approved import job's draft into an admin product record.
 * This is the human-review gate from the spec: nothing reaches here
 * automatically, only via an explicit admin approval action.
 */
export async function publishImportJob(jobId: string): Promise<AdminProduct> {
  const jobs = await listImportJobs();
  const job = jobs.find((j) => j.id === jobId);
  if (!job || !job.draft) {
    throw new Error("این کار واردسازی یافت نشد یا هنوز پیش‌نویسی ندارد.");
  }

  const draft = job.draft;
  let priceToman = 0;
  let note: string | undefined;
  if (draft.priceOriginal && draft.currencyOriginal) {
    const converted = await convertToToman(draft.priceOriginal, draft.currencyOriginal);
    priceToman = converted.toman;
    note = converted.note;
  }

  const product: AdminProduct = {
    id: randomUUID(),
    title: draft.titleFa,
    sku: job.sourceUrl.split("/").filter(Boolean).slice(-1)[0] ?? "UNKNOWN-SKU",
    brand: draft.brand ?? "نامشخص",
    category: draft.categorySuggestion,
    status: "pending_review",
    priceToman,
    stock: 0,
    updatedAtJalali: toJalaliPlaceholder(),
  };

  const existing = await listImportedProducts();
  existing.unshift(product);
  await writeCollection(PUBLISHED_COLLECTION, existing);

  const jobIndex = jobs.findIndex((j) => j.id === jobId);
  jobs[jobIndex] = { ...job, status: "published" };
  await writeCollection("import-jobs", jobs);

  if (note) {
    // Surfaced to the caller so the admin UI can show "price needs manual entry".
    (product as AdminProduct & { _fxNote?: string })._fxNote = note;
  }

  return product;
}

export async function getImportJob(jobId: string): Promise<ImportJobRecord | undefined> {
  const jobs = await listImportJobs();
  return jobs.find((j) => j.id === jobId);
}

import "server-only";

/**
 * Thin client over the Apify REST API — no SDK dependency, just the
 * documented run/poll/dataset endpoints. Requires APIFY_API_TOKEN.
 * Cannot be exercised from this sandbox (api.apify.com is unreachable
 * here — confirmed via a direct network check); this is written to run
 * correctly wherever it's actually deployed.
 */

const APIFY_BASE = "https://api.apify.com/v2";
const DEFAULT_ACTOR_ID = process.env.APIFY_ACTOR_ID ?? "apify/website-content-crawler";
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 60; // ~2 minutes

function requireToken(): string {
  const token = process.env.APIFY_API_TOKEN;
  if (!token) {
    throw new Error(
      "APIFY_API_TOKEN تنظیم نشده است. این متغیر محیطی باید در Vercel یا فایل .env.local تعریف شود."
    );
  }
  return token;
}

type ActorRun = {
  id: string;
  status: "READY" | "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMED-OUT" | "ABORTED";
  defaultDatasetId: string;
};

async function apifyFetch(pathname: string, init?: RequestInit): Promise<Response> {
  const token = requireToken();
  const url = `${APIFY_BASE}${pathname}${pathname.includes("?") ? "&" : "?"}token=${token}`;
  return fetch(url, init);
}

/**
 * Starts an actor run against the given start URLs and waits (short-polls)
 * for it to finish, returning the resulting dataset items.
 */
export async function runCrawlAndGetItems(
  startUrls: string[],
  options: { actorId?: string; maxCrawlPages?: number } = {}
): Promise<unknown[]> {
  const actorId = options.actorId ?? DEFAULT_ACTOR_ID;
  const encodedActorId = actorId.replace("/", "~");

  const runResponse = await apifyFetch(`/acts/${encodedActorId}/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      startUrls: startUrls.map((url) => ({ url })),
      maxCrawlPages: options.maxCrawlPages ?? 1,
      crawlerType: "playwright:adaptive",
    }),
  });

  if (!runResponse.ok) {
    throw new Error(`Apify run request failed: ${runResponse.status} ${await runResponse.text()}`);
  }

  const { data: run } = (await runResponse.json()) as { data: ActorRun };

  let currentRun = run;
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
    if (["SUCCEEDED", "FAILED", "TIMED-OUT", "ABORTED"].includes(currentRun.status)) break;
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    const statusResponse = await apifyFetch(`/actor-runs/${currentRun.id}`);
    const statusBody = (await statusResponse.json()) as { data: ActorRun };
    currentRun = statusBody.data;
  }

  if (currentRun.status !== "SUCCEEDED") {
    throw new Error(`Apify run did not succeed (status: ${currentRun.status}).`);
  }

  const itemsResponse = await apifyFetch(`/datasets/${currentRun.defaultDatasetId}/items`);
  if (!itemsResponse.ok) {
    throw new Error(`Failed to fetch Apify dataset items: ${itemsResponse.status}`);
  }
  return (await itemsResponse.json()) as unknown[];
}

import "server-only";
import { runCrawlAndGetItems } from "@/lib/apify-client";
import { readCollection, writeCollection } from "@/lib/store/json-store";

export type FxRateSnapshot = {
  fetchedAt: string;
  source: "bonbast.com";
  rates: Record<string, { buy: number; sell: number }>; // currency code -> Rial
  raw?: unknown;
  error?: string;
};

const RATES_COLLECTION = "fx-rates";
const BONBAST_URL = "https://www.bonbast.com/";

/**
 * bonbast.com renders rates client-side, so a real browser (Apify's
 * crawler) is used rather than a plain fetch. The exact selector/field
 * names below are a best-effort based on the site's known public layout
 * and CANNOT be verified live from this sandbox (api.apify.com and
 * bonbast.com are both unreachable here) — treat the parsing as a
 * starting point to adjust once it runs against real crawler output.
 */
function parseBonbastPage(pageText: string): Record<string, { buy: number; sell: number }> {
  const rates: Record<string, { buy: number; sell: number }> = {};
  const codes = ["USD", "EUR", "GBP", "TRY", "AED"];

  for (const code of codes) {
    const pattern = new RegExp(`${code}[^0-9]{0,20}([\\d,]{3,8})[^0-9]{1,10}([\\d,]{3,8})`, "i");
    const match = pageText.match(pattern);
    if (match) {
      rates[code] = {
        buy: Number(match[1].replace(/,/g, "")),
        sell: Number(match[2].replace(/,/g, "")),
      };
    }
  }
  return rates;
}

export async function fetchAndStoreFxRates(): Promise<FxRateSnapshot> {
  try {
    const items = await runCrawlAndGetItems([BONBAST_URL], { maxCrawlPages: 1 });
    const first = items[0] as Record<string, unknown> | undefined;
    const pageText = String(first?.text ?? first?.markdown ?? "");

    const rates = parseBonbastPage(pageText);
    const snapshot: FxRateSnapshot = {
      fetchedAt: new Date().toISOString(),
      source: "bonbast.com",
      rates,
      raw: first,
    };
    await appendSnapshot(snapshot);
    return snapshot;
  } catch (error) {
    const snapshot: FxRateSnapshot = {
      fetchedAt: new Date().toISOString(),
      source: "bonbast.com",
      rates: {},
      error: error instanceof Error ? error.message : "خطای ناشناخته در دریافت نرخ ارز.",
    };
    await appendSnapshot(snapshot);
    return snapshot;
  }
}

async function appendSnapshot(snapshot: FxRateSnapshot): Promise<void> {
  const history = await readCollection<FxRateSnapshot[]>(RATES_COLLECTION, []);
  history.unshift(snapshot);
  await writeCollection(RATES_COLLECTION, history.slice(0, 200));
}

export async function getLatestFxRates(): Promise<FxRateSnapshot | null> {
  const history = await readCollection<FxRateSnapshot[]>(RATES_COLLECTION, []);
  return history[0] ?? null;
}

export async function getFxRateHistory(limit = 50): Promise<FxRateSnapshot[]> {
  const history = await readCollection<FxRateSnapshot[]>(RATES_COLLECTION, []);
  return history.slice(0, limit);
}

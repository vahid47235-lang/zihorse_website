import "server-only";
import dns from "dns/promises";
import net from "net";

/**
 * SSRF-guarded fetch for the AI Import Studio's crawler step.
 * Per the import-engine security requirements: HTTPS only, reject
 * localhost/private-network targets, resolve DNS and re-check the
 * resolved address (including after every redirect hop), cap
 * redirects, enforce a response-size limit and a timeout.
 */

const MAX_REDIRECTS = 3;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_RESPONSE_BYTES = 5 * 1024 * 1024; // 5MB

export class UnsafeUrlError extends Error {}

function isPrivateOrReservedIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);
    if (a === 127) return true; // loopback
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 0) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === "::1") return true; // loopback
    if (lower.startsWith("fe80:")) return true; // link-local
    if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // unique local
    return false;
  }
  return true; // unparsable -> treat as unsafe
}

async function assertHostIsSafe(hostname: string): Promise<void> {
  if (hostname === "localhost") {
    throw new UnsafeUrlError("آدرس‌های محلی (localhost) مجاز نیستند.");
  }
  const records = await dns.lookup(hostname, { all: true });
  if (records.length === 0) {
    throw new UnsafeUrlError("امکان یافتن آدرس IP برای این دامنه وجود ندارد.");
  }
  for (const { address } of records) {
    if (isPrivateOrReservedIp(address)) {
      throw new UnsafeUrlError("این آدرس به یک شبکه داخلی یا محافظت‌شده اشاره می‌کند و مجاز نیست.");
    }
  }
}

export function validateImportUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new UnsafeUrlError("آدرس واردشده معتبر نیست.");
  }
  if (url.protocol !== "https:") {
    throw new UnsafeUrlError("فقط آدرس‌های HTTPS پذیرفته می‌شوند.");
  }
  return url;
}

/**
 * Fetches a product page with SSRF protection, manually following
 * redirects so each hop's resolved address is re-validated.
 */
export async function safeFetchHtml(rawUrl: string): Promise<{ finalUrl: string; html: string }> {
  let currentUrl = validateImportUrl(rawUrl);

  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    await assertHostIsSafe(currentUrl.hostname);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(currentUrl.toString(), {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "ZiHorseImportBot/1.0 (+https://zihorse.ir/import-policy)",
          Accept: "text/html,application/xhtml+xml",
        },
      });
    } finally {
      clearTimeout(timeout);
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new UnsafeUrlError("سرور بدون آدرس هدایت پاسخ داد.");
      currentUrl = validateImportUrl(new URL(location, currentUrl).toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(`سرور مبدأ با خطای ${response.status} پاسخ داد.`);
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      throw new UnsafeUrlError("نوع محتوای این آدرس، صفحه HTML نیست.");
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error("پاسخ سرور قابل خوانش نبود.");

    const chunks: Uint8Array[] = [];
    let total = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_RESPONSE_BYTES) {
        throw new UnsafeUrlError("حجم پاسخ از حد مجاز بیشتر است.");
      }
      chunks.push(value);
    }
    const html = Buffer.concat(chunks.map((c) => Buffer.from(c))).toString("utf-8");
    return { finalUrl: currentUrl.toString(), html };
  }

  throw new UnsafeUrlError("تعداد هدایت‌های (redirect) این آدرس از حد مجاز بیشتر است.");
}

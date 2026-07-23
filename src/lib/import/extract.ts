import "server-only";

export type RawExtraction = {
  title?: string;
  description?: string;
  images: string[];
  priceAmount?: number;
  priceCurrency?: string;
  brand?: string;
  sku?: string;
  availability?: string;
  bodyTextSample: string;
};

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractJsonLdProduct(html: string): Record<string, unknown> | null {
  const blocks = [...html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of blocks) {
    try {
      const parsed = JSON.parse(block[1].trim());
      const candidates = Array.isArray(parsed) ? parsed : [parsed, ...(parsed["@graph"] ?? [])];
      for (const item of candidates) {
        const type = item?.["@type"];
        const types = Array.isArray(type) ? type : [type];
        if (types.includes("Product")) return item;
      }
    } catch {
      // ignore malformed JSON-LD blocks
    }
  }
  return null;
}

function extractMeta(html: string, property: string): string | undefined {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
    "i"
  );
  const match = html.match(re);
  return match ? decodeEntities(match[1]) : undefined;
}

/**
 * Generic extraction adapter: JSON-LD Product schema first, then Open Graph
 * metadata, then a stripped-text fallback for the AI extraction step to
 * work from. This mirrors the pipeline's documented source priority.
 */
export function extractProductData(html: string): RawExtraction {
  const jsonLd = extractJsonLdProduct(html);

  const offers = jsonLd?.offers as Record<string, unknown> | Record<string, unknown>[] | undefined;
  const offer = Array.isArray(offers) ? offers[0] : offers;

  const title =
    (jsonLd?.name as string | undefined) ??
    extractMeta(html, "og:title") ??
    html.match(/<title>([^<]*)<\/title>/i)?.[1];

  const description =
    (jsonLd?.description as string | undefined) ?? extractMeta(html, "og:description");

  const images: string[] = [];
  const ogImage = extractMeta(html, "og:image");
  if (ogImage) images.push(ogImage);
  if (jsonLd?.image) {
    const imgs = Array.isArray(jsonLd.image) ? jsonLd.image : [jsonLd.image];
    for (const img of imgs) if (typeof img === "string") images.push(img);
  }

  const brand = jsonLd?.brand
    ? typeof jsonLd.brand === "string"
      ? jsonLd.brand
      : ((jsonLd.brand as Record<string, unknown>)?.name as string | undefined)
    : undefined;

  return {
    title: title ? decodeEntities(title.trim()) : undefined,
    description: description ? decodeEntities(description.trim()) : undefined,
    images: [...new Set(images)].slice(0, 6),
    priceAmount: offer?.price !== undefined ? Number(offer.price) : undefined,
    priceCurrency: (offer?.priceCurrency as string | undefined) ?? undefined,
    brand,
    sku: (jsonLd?.sku as string | undefined) ?? (jsonLd?.mpn as string | undefined),
    availability: offer?.availability as string | undefined,
    bodyTextSample: stripTags(html).slice(0, 6000),
  };
}

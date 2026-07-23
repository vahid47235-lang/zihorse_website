import "server-only";
import OpenAI from "openai";
import { z } from "zod";
import type { RawExtraction } from "./extract";

/**
 * The translation/understanding agent. Turns whatever the crawler agent
 * extracted into a Persian product draft using OpenAI structured outputs,
 * following the platform's translation rules: natural Persian, never
 * translate brand names or SKU/GTIN, never invent specs or claims, flag
 * uncertain fields for human review instead of guessing.
 *
 * Cannot be exercised from this sandbox (api.openai.com is unreachable
 * here); written to run correctly wherever OPENAI_API_KEY is set with
 * real network access (Vercel, or a normal server).
 */

const draftSchema = z.object({
  titleFa: z.string(),
  shortDescriptionFa: z.string(),
  longDescriptionFa: z.string(),
  brand: z.string().nullable(),
  categorySuggestion: z.string(),
  attributes: z.array(z.object({ label: z.string(), value: z.string() })),
  riderGender: z.enum(["مردانه", "زنانه", "بچگانه", "یونیسکس", "نامشخص"]),
  discipline: z.string().nullable(),
  material: z.string().nullable(),
  colorFa: z.string().nullable(),
  sizeOptions: z.array(z.string()),
  priceOriginal: z.number().nullable(),
  currencyOriginal: z.string().nullable(),
  uncertainFields: z.array(z.string()),
  seoTitleFa: z.string(),
  seoDescriptionFa: z.string(),
});

export type ProductDraft = z.infer<typeof draftSchema>;

export type TranslationResult = {
  draft: ProductDraft;
  model: string;
  promptTokens: number;
  completionTokens: number;
};

const SYSTEM_PROMPT = `شما دستیار استخراج و ترجمه محصولات برای فروشگاه اینترنتی تخصصی سوارکاری «زی‌هورس» هستید.
قوانین اجباری:
- فقط بر اساس داده‌های ورودی عمل کن؛ هرگز مشخصات، قیمت یا گواهی جدید نساز.
- نام برند و کدهای SKU/GTIN/مدل را ترجمه نکن؛ همان‌طور که هست نگه دار.
- متن فارسی باید طبیعی، حرفه‌ای و مناسب مشتری ایرانی باشد، نه ترجمه ماشینی کلمه‌به‌کلمه.
- اگر مقداری از متن ورودی به‌طور قطع مشخص نیست (مثل رنگ دقیق یا جنس)، آن را در uncertainFields فهرست کن و مقدار را null بگذار، حدس نزن.
- دسته‌بندی پیشنهادی را از میان این‌ها انتخاب کن یا نزدیک‌ترین مورد را بنویس: پوشاک سوارکاری، تجهیزات سوارکار، تجهیزات اسب، مراقبت از اسب.`;

function buildUserPrompt(sourceUrl: string, extraction: RawExtraction): string {
  return JSON.stringify(
    {
      sourceUrl,
      title: extraction.title,
      description: extraction.description,
      brand: extraction.brand,
      sku: extraction.sku,
      priceAmount: extraction.priceAmount,
      priceCurrency: extraction.priceCurrency,
      bodyTextSample: extraction.bodyTextSample,
    },
    null,
    2
  );
}

export async function translateAndStructureProduct(
  sourceUrl: string,
  extraction: RawExtraction
): Promise<TranslationResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY تنظیم نشده است.");
  }

  const client = new OpenAI({ apiKey });
  const model = process.env.OPENAI_IMPORT_MODEL ?? "gpt-4o-mini";

  const completion = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(sourceUrl, extraction) },
    ],
    response_format: {
      type: "json_schema",
      json_schema: {
        name: "zihorse_product_draft",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          required: [
            "titleFa",
            "shortDescriptionFa",
            "longDescriptionFa",
            "brand",
            "categorySuggestion",
            "attributes",
            "riderGender",
            "discipline",
            "material",
            "colorFa",
            "sizeOptions",
            "priceOriginal",
            "currencyOriginal",
            "uncertainFields",
            "seoTitleFa",
            "seoDescriptionFa",
          ],
          properties: {
            titleFa: { type: "string" },
            shortDescriptionFa: { type: "string" },
            longDescriptionFa: { type: "string" },
            brand: { type: ["string", "null"] },
            categorySuggestion: { type: "string" },
            attributes: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["label", "value"],
                properties: { label: { type: "string" }, value: { type: "string" } },
              },
            },
            riderGender: { type: "string", enum: ["مردانه", "زنانه", "بچگانه", "یونیسکس", "نامشخص"] },
            discipline: { type: ["string", "null"] },
            material: { type: ["string", "null"] },
            colorFa: { type: ["string", "null"] },
            sizeOptions: { type: "array", items: { type: "string" } },
            priceOriginal: { type: ["number", "null"] },
            currencyOriginal: { type: ["string", "null"] },
            uncertainFields: { type: "array", items: { type: "string" } },
            seoTitleFa: { type: "string" },
            seoDescriptionFa: { type: "string" },
          },
        },
      },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("پاسخ خالی از OpenAI دریافت شد.");

  const parsed = draftSchema.parse(JSON.parse(content));

  return {
    draft: parsed,
    model,
    promptTokens: completion.usage?.prompt_tokens ?? 0,
    completionTokens: completion.usage?.completion_tokens ?? 0,
  };
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { getBrandBySlug, getProductBySlug, getRelatedProducts, products } from "@/lib/mock-data";
import { formatToman } from "@/lib/utils";
import { Star, Truck, ShieldCheck } from "lucide-react";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  return { title: product?.title ?? "محصول یافت نشد" };
}

const stockLabel: Record<string, { text: string; tone: "success" | "warning" | "error" }> = {
  in_stock: { text: "موجود در انبار", tone: "success" },
  low_stock: { text: "موجودی محدود", tone: "warning" },
  backorder: { text: "پیش‌سفارش", tone: "warning" },
  out_of_stock: { text: "ناموجود", tone: "error" },
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const brand = getBrandBySlug(product.brandSlug);
  const related = getRelatedProducts(product);
  const stock = stockLabel[product.stockStatus];

  return (
    <div className="container-editorial py-8 md:py-12">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="grid gap-3">
          <MediaPlaceholder label={product.media[0]?.alt ?? product.title} ratio="aspect-[4/5]" />
          {product.media.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.media.slice(1).map((m) => (
                <MediaPlaceholder key={m.id} label={m.alt} ratio="aspect-square" />
              ))}
            </div>
          )}
        </div>

        {/* Purchase panel */}
        <div>
          {brand && (
            <p className="text-sm font-medium text-bronze-600">{brand.name}</p>
          )}
          <h1 className="mt-1 font-display text-2xl font-bold text-midnight-900 md:text-3xl">
            {product.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-sm text-midnight-500">
            <Star className="h-4 w-4 fill-bronze-500 text-bronze-500" />
            <span>{product.rating.toFixed(1)}</span>
            <span>({product.reviewCount} نظر)</span>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold text-midnight-900">
              {formatToman(product.price.amountToman)}
            </span>
            {product.price.compareAtToman && (
              <span className="text-base text-midnight-400 line-through">
                {formatToman(product.price.compareAtToman)}
              </span>
            )}
          </div>

          <p className="mt-4 leading-8 text-midnight-600">{product.shortDescription}</p>

          <div className="mt-5">
            <Badge tone={stock.tone}>{stock.text}</Badge>
          </div>

          {product.variants.length > 0 && (
            <fieldset className="mt-6">
              <legend className="text-sm font-medium text-midnight-800">سایز</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={`flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-sm border px-3 text-sm ${
                      variant.stockStatus === "out_of_stock"
                        ? "border-neutral-medium text-midnight-300 line-through"
                        : "border-midnight-900 text-midnight-900 hover:bg-midnight-900 hover:text-ivory-100"
                    }`}
                  >
                    <input
                      type="radio"
                      name="size"
                      value={variant.id}
                      disabled={variant.stockStatus === "out_of_stock"}
                      className="sr-only"
                    />
                    {variant.size ?? variant.color}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" disabled={product.stockStatus === "out_of_stock"}>
              {product.stockStatus === "out_of_stock" ? "ناموجود" : "افزودن به سبد خرید"}
            </Button>
          </div>

          <div className="mt-6 space-y-3 rounded-sm border border-neutral-medium p-4">
            <div className="flex items-center gap-2 text-sm text-midnight-700">
              <Truck className="h-4 w-4 text-bronze-500" />
              ارسال به سراسر ایران، تحویل ۲ تا ۵ روز کاری
            </div>
            <div className="flex items-center gap-2 text-sm text-midnight-700">
              <ShieldCheck className="h-4 w-4 text-bronze-500" />
              ضمانت اصالت و امکان بازگشت تا ۷ روز
            </div>
          </div>

          {product.attributes.length > 0 && (
            <div className="mt-8">
              <h2 className="text-sm font-semibold text-midnight-900">مشخصات فنی</h2>
              <dl className="mt-3 divide-y divide-neutral-medium border-y border-neutral-medium text-sm">
                {product.attributes.map((attr) => (
                  <div key={attr.label} className="flex justify-between py-2.5">
                    <dt className="text-midnight-500">{attr.label}</dt>
                    <dd className="font-medium text-midnight-900">{attr.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-xl font-bold text-midnight-900">توضیحات محصول</h2>
        <p className="mt-4 leading-8 text-midnight-600">{product.description}</p>
        {product.careInstructions.length > 0 && (
          <>
            <h3 className="mt-6 text-sm font-semibold text-midnight-900">راهنمای نگهداری</h3>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm leading-7 text-midnight-600">
              {product.careInstructions.map((instruction) => (
                <li key={instruction}>{instruction}</li>
              ))}
            </ul>
          </>
        )}
      </section>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-xl font-bold text-midnight-900">محصولات مرتبط</h2>
          <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product/product-card";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { categories, getCategoryBySlug, getProductsByCategory, products } from "@/lib/mock-data";

export function generateStaticParams() {
  return [...categories.map((c) => ({ slug: c.slug })), { slug: "jadidtarin-ha" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  return { title: category?.title ?? "جدیدترین‌ها" };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const isNewArrivals = slug === "jadidtarin-ha";
  const category = getCategoryBySlug(slug);

  if (!category && !isNewArrivals) {
    notFound();
  }

  const categoryProducts = isNewArrivals ? products : getProductsByCategory(slug);
  const title = isNewArrivals ? "جدیدترین‌ها" : category!.title;
  const description = isNewArrivals
    ? "تازه‌ترین محصولات اضافه‌شده به مجموعه زی‌هورس."
    : category!.description;

  return (
    <div>
      <section className="relative border-b border-neutral-medium">
        <MediaPlaceholder label={title} ratio="aspect-[16/6]" />
        <div className="container-editorial py-8">
          <h1 className="font-display text-2xl font-bold text-midnight-900 md:text-3xl">{title}</h1>
          <p className="mt-3 max-w-2xl leading-8 text-midnight-600">{description}</p>
        </div>
      </section>

      <section className="container-editorial py-10">
        {categoryProducts.length === 0 ? (
          <EmptyCategoryState />
        ) : (
          <>
            <p className="mb-6 text-sm text-midnight-500">
              {categoryProducts.length} محصول
            </p>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function EmptyCategoryState() {
  return (
    <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-neutral-medium py-16 text-center">
      <p className="text-base font-medium text-midnight-800">
        در حال حاضر محصولی در این دسته موجود نیست
      </p>
      <p className="max-w-sm text-sm text-midnight-500">
        به‌زودی محصولات جدیدی به این مجموعه اضافه می‌شود. مجموعه‌های مشابه را مشاهده کنید.
      </p>
    </div>
  );
}

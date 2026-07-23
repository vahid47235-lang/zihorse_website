import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { ProductCard } from "@/components/product/product-card";
import { categories, products } from "@/lib/mock-data";
import { ShieldCheck, Truck, RotateCcw, Award } from "lucide-react";

const trustFeatures = [
  { icon: ShieldCheck, title: "ضمانت اصالت", desc: "تمام محصولات دارای ضمانت اصالت و کیفیت هستند." },
  { icon: Truck, title: "ارسال سریع", desc: "ارسال به سراسر ایران با بسته‌بندی ویژه." },
  { icon: RotateCcw, title: "بازگشت آسان", desc: "امکان بازگشت کالا تا ۷ روز پس از خرید." },
  { icon: Award, title: "انتخاب کارشناسی", desc: "گزینش محصولات توسط کارشناسان سوارکاری." },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-midnight-900 via-midnight-800 to-saddle-700 md:aspect-[16/7]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(154,116,71,0.25),transparent_55%)]" />
          <div className="container-editorial relative z-10 flex h-full flex-col items-start justify-center gap-5 py-16 md:max-w-xl">
            <span className="text-xs font-medium tracking-widest text-bronze-300">
              مجموعه پاییز و زمستان
            </span>
            <h1 className="font-display text-3xl font-bold leading-[1.3] text-ivory-50 md:text-5xl">
              هماهنگی در حرکت، ظرافت در انتخاب
            </h1>
            <p className="text-base leading-8 text-ivory-200 md:text-lg">
              مجموعه‌ای منتخب از پوشاک و تجهیزات حرفه‌ای برای سوارکار و اسب
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Button href="/categories/jadidtarin-ha" variant="accent" size="lg">
                مشاهده مجموعه
              </Button>
              <Button href="/pages/size-guide" variant="secondary" size="lg" className="border-ivory-100 text-ivory-50 hover:bg-ivory-50 hover:text-midnight-900">
                راهنمای انتخاب
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust features */}
      <section className="border-b border-neutral-medium bg-ivory-50">
        <div className="container-editorial grid grid-cols-2 gap-6 py-8 md:grid-cols-4">
          {trustFeatures.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3">
              <Icon className="mt-0.5 h-6 w-6 shrink-0 text-bronze-500" />
              <div>
                <h3 className="text-sm font-semibold text-midnight-900">{title}</h3>
                <p className="mt-1 text-xs leading-6 text-midnight-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Editorial category storytelling */}
      <section className="container-editorial py-14 md:py-20">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-midnight-900 md:text-3xl">
            مجموعه‌ها به تفکیک نیاز
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`} className="group block">
              <MediaPlaceholder label={category.title} ratio="aspect-square" />
              <h3 className="mt-3 text-sm font-medium text-midnight-900 group-hover:text-bronze-600">
                {category.title}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-ivory-50 py-14 md:py-20">
        <div className="container-editorial">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-midnight-900 md:text-3xl">
              جدیدترین‌ها
            </h2>
            <Link href="/categories/jadidtarin-ha" className="text-sm font-medium text-bronze-600 hover:underline">
              مشاهده همه
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Buying guide callout */}
      <section className="container-editorial grid gap-8 py-14 md:grid-cols-2 md:items-center md:py-20">
        <MediaPlaceholder label="راهنمای انتخاب کلاه ایمنی" ratio="aspect-[4/3]" />
        <div>
          <span className="text-xs font-medium tracking-widest text-bronze-600">
            راهنمای خرید
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold leading-relaxed text-midnight-900 md:text-3xl">
            چطور کلاه ایمنی مناسب خود را انتخاب کنید؟
          </h2>
          <p className="mt-4 leading-8 text-midnight-600">
            انتخاب کلاه ایمنی مناسب یکی از مهم‌ترین تصمیمات هر سوارکار است. در این راهنما،
            معیارهای استاندارد ایمنی، تهویه و تنظیم دقیق را بررسی می‌کنیم.
          </p>
          <Button href="/magazine" variant="link" className="mt-4">
            مطالعه راهنما ←
          </Button>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-neutral-medium bg-midnight-900 py-14 text-ivory-100 md:py-16">
        <div className="container-editorial flex flex-col items-center gap-5 text-center">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            به باشگاه زی‌هورس بپیوندید
          </h2>
          <p className="max-w-md text-sm leading-7 text-ivory-300">
            از جدیدترین محصولات، راهنماهای تخصصی و پیشنهادهای ویژه باخبر شوید.
          </p>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">
              ایمیل
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="ایمیل خود را وارد کنید"
              className="h-12 flex-1 rounded-sm border border-midnight-600 bg-midnight-800 px-4 text-sm text-ivory-100 placeholder:text-ivory-400 focus:outline-2 focus:outline-bronze-500"
            />
            <Button type="submit" variant="accent" size="md">
              عضویت
            </Button>
          </form>
        </div>
      </section>
    </div>
  );
}

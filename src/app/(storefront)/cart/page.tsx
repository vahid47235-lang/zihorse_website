import Link from "next/link";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/mock-data";
import { formatToman } from "@/lib/utils";
import { Trash2 } from "lucide-react";

/** Cart page rendered against mock line items until the real cart API lands. */
const mockCartItems = [
  { product: products[0], variant: products[0].variants[0], quantity: 1 },
  { product: products[1], variant: products[1].variants[0], quantity: 1 },
];

export default function CartPage() {
  const isEmpty = mockCartItems.length === 0;
  const subtotal = mockCartItems.reduce(
    (sum, item) => sum + item.variant.price.amountToman * item.quantity,
    0
  );

  if (isEmpty) {
    return (
      <div className="container-editorial flex flex-col items-center gap-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-midnight-900">سبد خرید شما خالی است</h1>
        <p className="text-midnight-500">محصولات مورد نظر خود را از مجموعه زی‌هورس انتخاب کنید.</p>
        <Button href="/" variant="primary" size="lg" className="mt-2">
          مشاهده محصولات
        </Button>
      </div>
    );
  }

  return (
    <div className="container-editorial py-8 md:py-12">
      <h1 className="font-display text-2xl font-bold text-midnight-900 md:text-3xl">سبد خرید</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <ul className="divide-y divide-neutral-medium border-y border-neutral-medium">
          {mockCartItems.map(({ product, variant, quantity }) => (
            <li key={variant.id} className="flex gap-4 py-5">
              <MediaPlaceholder label={product.title} ratio="aspect-square" className="w-24 shrink-0" />
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/products/${product.slug}`} className="text-sm font-medium text-midnight-900 hover:text-bronze-600">
                    {product.title}
                  </Link>
                  <p className="mt-1 text-xs text-midnight-500">سایز: {variant.size ?? variant.color}</p>
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm">
                    <span className="sr-only">تعداد</span>
                    <select
                      defaultValue={quantity}
                      className="h-9 rounded-sm border border-neutral-medium px-2 text-sm"
                    >
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </label>
                  <span className="text-sm font-semibold text-midnight-900">
                    {formatToman(variant.price.amountToman * quantity)}
                  </span>
                </div>
              </div>
              <button aria-label="حذف از سبد خرید" className="self-start text-midnight-400 hover:text-error">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>

        {/* Order summary */}
        <aside className="rounded-sm border border-neutral-medium p-5">
          <h2 className="text-sm font-semibold text-midnight-900">خلاصه سفارش</h2>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <div className="flex justify-between text-midnight-600">
              <span>جمع کالاها</span>
              <span>{formatToman(subtotal)}</span>
            </div>
            <div className="flex justify-between text-midnight-600">
              <span>هزینه ارسال</span>
              <span>در مرحله بعد محاسبه می‌شود</span>
            </div>
          </div>
          <div className="mt-4 flex justify-between border-t border-neutral-medium pt-4 text-base font-semibold text-midnight-900">
            <span>مبلغ قابل پرداخت</span>
            <span>{formatToman(subtotal)}</span>
          </div>
          <label className="mt-4 flex gap-2">
            <span className="sr-only">کد تخفیف</span>
            <input
              type="text"
              placeholder="کد تخفیف"
              className="h-11 flex-1 rounded-sm border border-neutral-medium px-3 text-sm focus:outline-2 focus:outline-bronze-500"
            />
            <Button variant="secondary" size="md">
              اعمال
            </Button>
          </label>
          <Button href="/checkout" variant="primary" size="lg" className="mt-5 w-full">
            ادامه فرایند خرید
          </Button>
        </aside>
      </div>
    </div>
  );
}

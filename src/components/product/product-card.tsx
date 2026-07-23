import Link from "next/link";
import { MediaPlaceholder } from "@/components/ui/media-placeholder";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/lib/types";
import { formatToman } from "@/lib/utils";
import { Star } from "lucide-react";

export function ProductCard({ product }: { product: Product }) {
  const isOutOfStock = product.stockStatus === "out_of_stock";

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze-500"
    >
      <div className="relative">
        <MediaPlaceholder label={product.title} />
        {product.badges.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {product.badges.map((badge) => (
              <Badge key={badge} tone={badge === "تخفیف‌دار" ? "warning" : "neutral"}>
                {badge}
              </Badge>
            ))}
          </div>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-midnight-900/50">
            <span className="rounded-sm bg-ivory-100 px-3 py-1.5 text-sm font-medium text-midnight-900">
              ناموجود
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-midnight-900 group-hover:text-bronze-600 transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center gap-1 text-xs text-midnight-500">
          <Star className="h-3.5 w-3.5 fill-bronze-500 text-bronze-500" />
          <span>{product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-semibold text-midnight-900">
            {formatToman(product.price.amountToman)}
          </span>
          {product.price.compareAtToman && (
            <span className="text-xs text-midnight-400 line-through">
              {formatToman(product.price.compareAtToman)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

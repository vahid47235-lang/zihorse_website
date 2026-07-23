import Link from "next/link";
import { PageHeader, StatusPill } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { Button } from "@/components/ui/button";
import { adminProducts } from "@/lib/admin-mock-data";
import { listImportedProducts } from "@/lib/import/publish";
import { formatToman } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export default async function AdminProductsPage() {
  const importedProducts = await listImportedProducts();
  const allProducts = [...importedProducts, ...adminProducts];

  return (
    <div>
      <PageHeader
        title="محصولات"
        description={`${allProducts.length} محصول در کاتالوگ (${importedProducts.length} مورد از استودیوی واردسازی هوشمند)`}
        actions={
          <>
            <Button href="/admin/products/import" variant="accent" size="sm">
              <Sparkles className="h-4 w-4" />
              واردسازی با هوش مصنوعی
            </Button>
            <Button variant="secondary" size="sm">
              افزودن محصول جدید
            </Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {["همه", "منتشرشده", "پیش‌نویس", "در انتظار بررسی", "بایگانی"].map((filter, i) => (
          <button
            key={filter}
            className={`rounded-sm px-3 py-1.5 text-sm ${
              i === 0 ? "bg-midnight-900 text-ivory-100" : "border border-neutral-medium text-midnight-600 hover:bg-ivory-50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <Table>
        <Thead>
          <Th>
            <input type="checkbox" aria-label="انتخاب همه" />
          </Th>
          <Th>محصول</Th>
          <Th>SKU</Th>
          <Th>برند</Th>
          <Th>دسته‌بندی</Th>
          <Th>قیمت</Th>
          <Th>موجودی</Th>
          <Th>وضعیت</Th>
          <Th>آخرین بروزرسانی</Th>
        </Thead>
        <Tbody>
          {allProducts.map((product) => (
            <Tr key={product.id}>
              <Td>
                <input type="checkbox" aria-label={`انتخاب ${product.title}`} />
              </Td>
              <Td className="font-medium text-midnight-900">
                <Link href="#" className="hover:text-bronze-600">
                  {product.title}
                </Link>
              </Td>
              <Td className="font-mono text-xs text-midnight-500">{product.sku}</Td>
              <Td>{product.brand}</Td>
              <Td>{product.category}</Td>
              <Td>
                {product.priceToman > 0 ? formatToman(product.priceToman) : (
                  <span className="text-xs text-warning">نیاز به ثبت دستی قیمت</span>
                )}
              </Td>
              <Td className={product.stock === 0 ? "text-error" : undefined}>{product.stock}</Td>
              <Td>
                <StatusPill status={product.status} />
              </Td>
              <Td className="text-midnight-500">{product.updatedAtJalali}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

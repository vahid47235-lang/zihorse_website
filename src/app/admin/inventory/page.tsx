import { PageHeader } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { inventoryRows, warehouses } from "@/lib/admin-mock-data";

export default function AdminInventoryPage() {
  return (
    <div>
      <PageHeader title="انبار و موجودی" description="مدیریت موجودی به تفکیک انبار و رزرو کالا." />

      <h2 className="mb-3 text-sm font-semibold text-midnight-900">انبارها</h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {warehouses.map((w) => (
          <div key={w.id} className="rounded-sm border border-neutral-medium bg-ivory-50 p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium text-midnight-900">{w.name}</p>
              {w.isDefault && <Badge tone="accent">پیش‌فرض</Badge>}
            </div>
            <p className="mt-1 text-sm text-midnight-500">{w.city}</p>
            <p className="mt-2 text-xs text-midnight-400">{w.skuCount} کد کالا</p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-semibold text-midnight-900">سطح موجودی</h2>
      <Table>
        <Thead>
          <Th>SKU</Th>
          <Th>محصول</Th>
          <Th>انبار</Th>
          <Th>موجود فیزیکی</Th>
          <Th>رزروشده</Th>
          <Th>قابل فروش</Th>
          <Th>وضعیت</Th>
        </Thead>
        <Tbody>
          {inventoryRows.map((row) => {
            const low = row.available <= row.lowStockThreshold;
            return (
              <Tr key={row.id}>
                <Td className="font-mono text-xs text-midnight-500">{row.sku}</Td>
                <Td className="font-medium text-midnight-900">{row.productTitle}</Td>
                <Td>{row.warehouse}</Td>
                <Td>{row.onHand}</Td>
                <Td>{row.reserved}</Td>
                <Td className={low ? "font-medium text-warning" : undefined}>{row.available}</Td>
                <Td>
                  <Badge tone={low ? "warning" : "success"}>{low ? "موجودی کم" : "موجود"}</Badge>
                </Td>
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
}

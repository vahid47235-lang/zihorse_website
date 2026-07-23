import { PageHeader, StatCard, StatusPill } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { adminOrders, adminProducts, importJobs, inventoryRows } from "@/lib/admin-mock-data";
import { formatToman } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";

export default function AdminDashboardPage() {
  const lowStock = inventoryRows.filter((r) => r.available <= r.lowStockThreshold);
  const pendingImports = importJobs.filter((j) => j.status === "review" || j.status === "translating");
  const recentOrders = adminOrders.slice(0, 5);
  const revenueToday = adminOrders
    .filter((o) => o.status !== "لغوشده" && o.status !== "در انتظار پرداخت")
    .reduce((sum, o) => sum + o.totalToman, 0);

  return (
    <div>
      <PageHeader title="داشبورد" description="نمای کلی فروش، سفارش‌ها و وضعیت عملیاتی زی‌هورس." />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="فروش این ماه" value={formatToman(revenueToday)} hint="از ۷ سفارش" />
        <StatCard label="سفارش‌های در انتظار" value="۲" tone="warning" hint="نیاز به پیگیری" />
        <StatCard label="محصولات کم‌موجودی" value={String(lowStock.length)} tone={lowStock.length > 0 ? "error" : "success"} />
        <StatCard label="واردسازی‌های در جریان" value={String(pendingImports.length)} hint="در استودیوی هوشمند" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-midnight-900">آخرین سفارش‌ها</h2>
          <Table>
            <Thead>
              <Th>شماره سفارش</Th>
              <Th>مشتری</Th>
              <Th>مبلغ</Th>
              <Th>وضعیت</Th>
            </Thead>
            <Tbody>
              {recentOrders.map((order) => (
                <Tr key={order.id}>
                  <Td className="font-medium text-midnight-900">{order.orderNumber}</Td>
                  <Td>{order.customerName}</Td>
                  <Td>{formatToman(order.totalToman)}</Td>
                  <Td>
                    <StatusPill status={order.status} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-midnight-900">هشدارهای موجودی</h2>
          <div className="space-y-2">
            {lowStock.length === 0 ? (
              <p className="rounded-sm border border-neutral-medium bg-ivory-50 p-4 text-sm text-midnight-500">
                در حال حاضر هشداری وجود ندارد.
              </p>
            ) : (
              lowStock.map((row) => (
                <div
                  key={row.id}
                  className="flex items-start gap-2 rounded-sm border border-warning/30 bg-warning/5 p-3"
                >
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                  <div>
                    <p className="text-sm font-medium text-midnight-900">{row.productTitle}</p>
                    <p className="text-xs text-midnight-500">
                      {row.warehouse} — موجودی قابل فروش: {row.available}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <h2 className="mb-3 mt-6 text-sm font-semibold text-midnight-900">محصولات نیازمند بررسی</h2>
          <div className="space-y-2">
            {adminProducts
              .filter((p) => p.status === "pending_review" || p.status === "draft")
              .map((p) => (
                <div key={p.id} className="flex items-center justify-between rounded-sm border border-neutral-medium bg-ivory-50 p-3">
                  <span className="text-sm text-midnight-800">{p.title}</span>
                  <StatusPill status={p.status} />
                </div>
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}

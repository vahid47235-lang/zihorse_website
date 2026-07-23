import { PageHeader, StatusPill } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { adminOrders } from "@/lib/admin-mock-data";
import { formatToman } from "@/lib/utils";

export default function AdminOrdersPage() {
  return (
    <div>
      <PageHeader title="سفارش‌ها" description={`${adminOrders.length} سفارش`} />

      <div className="mb-4 flex flex-wrap gap-2">
        {["همه", "در انتظار پرداخت", "پرداخت‌شده", "در حال آماده‌سازی", "ارسال‌شده", "تحویل‌شده", "مرجوع‌شده"].map(
          (filter, i) => (
            <button
              key={filter}
              className={`rounded-sm px-3 py-1.5 text-sm ${
                i === 0
                  ? "bg-midnight-900 text-ivory-100"
                  : "border border-neutral-medium text-midnight-600 hover:bg-ivory-50"
              }`}
            >
              {filter}
            </button>
          )
        )}
      </div>

      <Table>
        <Thead>
          <Th>شماره سفارش</Th>
          <Th>مشتری</Th>
          <Th>تعداد کالا</Th>
          <Th>مبلغ کل</Th>
          <Th>روش پرداخت</Th>
          <Th>وضعیت</Th>
          <Th>تاریخ ثبت</Th>
        </Thead>
        <Tbody>
          {adminOrders.map((order) => (
            <Tr key={order.id}>
              <Td className="font-medium text-midnight-900">{order.orderNumber}</Td>
              <Td>{order.customerName}</Td>
              <Td>{order.itemsCount}</Td>
              <Td>{formatToman(order.totalToman)}</Td>
              <Td className="text-midnight-500">{order.paymentProvider}</Td>
              <Td>
                <StatusPill status={order.status} />
              </Td>
              <Td className="text-midnight-500">{order.createdAtJalali}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

import { PageHeader, StatCard, StatusPill } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { paymentTxns } from "@/lib/admin-mock-data";
import { formatToman } from "@/lib/utils";

export default function AdminFinancePage() {
  const verified = paymentTxns.filter((t) => t.status === "تأییدشده");
  const totalVerified = verified.reduce((s, t) => s + t.amountToman, 0);
  const totalRefunded = paymentTxns
    .filter((t) => t.status === "بازگشت‌شده")
    .reduce((s, t) => s + t.amountToman, 0);

  return (
    <div>
      <PageHeader title="مالی" description="تراکنش‌های پرداخت، تسویه درگاه‌ها و گزارش درآمد." />

      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="درآمد تأییدشده" value={formatToman(totalVerified)} tone="success" />
        <StatCard label="مجموع بازگشتی" value={formatToman(totalRefunded)} tone="warning" />
        <StatCard label="تعداد تراکنش" value={String(paymentTxns.length)} />
        <StatCard label="نرخ موفقیت" value="۸۰٪" hint="۴ از ۵ تراکنش" />
      </div>

      <h2 className="mb-3 text-sm font-semibold text-midnight-900">تراکنش‌های پرداخت</h2>
      <Table>
        <Thead>
          <Th>شماره سفارش</Th>
          <Th>درگاه</Th>
          <Th>مبلغ</Th>
          <Th>وضعیت</Th>
          <Th>شناسه پیگیری درگاه</Th>
          <Th>تاریخ</Th>
        </Thead>
        <Tbody>
          {paymentTxns.map((txn) => (
            <Tr key={txn.id}>
              <Td className="font-medium text-midnight-900">{txn.orderNumber}</Td>
              <Td>{txn.provider}</Td>
              <Td>{formatToman(txn.amountToman)}</Td>
              <Td>
                <StatusPill status={txn.status} />
              </Td>
              <Td dir="ltr" className="text-left font-mono text-xs text-midnight-500">
                {txn.gatewayRef}
              </Td>
              <Td className="text-midnight-500">{txn.createdAtJalali}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

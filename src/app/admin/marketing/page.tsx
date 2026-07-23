import { PageHeader, StatusPill } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { Button } from "@/components/ui/button";
import { campaigns, coupons } from "@/lib/admin-mock-data";

export default function AdminMarketingPage() {
  return (
    <div>
      <PageHeader title="بازاریابی" description="کدهای تخفیف، کمپین‌ها و برنامه‌های وفاداری." />

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-midnight-900">کدهای تخفیف</h2>
          <Button variant="secondary" size="sm">
            کد تخفیف جدید
          </Button>
        </div>
        <Table>
          <Thead>
            <Th>کد</Th>
            <Th>نوع</Th>
            <Th>مقدار</Th>
            <Th>میزان استفاده</Th>
            <Th>وضعیت</Th>
            <Th>تاریخ انقضا</Th>
          </Thead>
          <Tbody>
            {coupons.map((c) => (
              <Tr key={c.id}>
                <Td className="font-mono font-medium text-midnight-900">{c.code}</Td>
                <Td>{c.type}</Td>
                <Td>{c.value}</Td>
                <Td className="text-midnight-500">
                  {c.usageCount.toLocaleString("fa-IR")}
                  {c.usageLimit > 0 && ` / ${c.usageLimit.toLocaleString("fa-IR")}`}
                </Td>
                <Td>
                  <StatusPill status={c.status} />
                </Td>
                <Td className="text-midnight-500">{c.expiresAtJalali}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-midnight-900">کمپین‌ها</h2>
          <Button variant="secondary" size="sm">
            کمپین جدید
          </Button>
        </div>
        <Table>
          <Thead>
            <Th>نام کمپین</Th>
            <Th>کانال</Th>
            <Th>وضعیت</Th>
            <Th>شروع</Th>
            <Th>پایان</Th>
          </Thead>
          <Tbody>
            {campaigns.map((c) => (
              <Tr key={c.id}>
                <Td className="font-medium text-midnight-900">{c.name}</Td>
                <Td>{c.channel}</Td>
                <Td>
                  <StatusPill status={c.status} />
                </Td>
                <Td className="text-midnight-500">{c.startAtJalali}</Td>
                <Td className="text-midnight-500">{c.endAtJalali}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </div>
    </div>
  );
}

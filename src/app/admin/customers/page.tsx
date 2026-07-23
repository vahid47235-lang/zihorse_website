import { PageHeader } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { adminCustomers } from "@/lib/admin-mock-data";
import { formatToman } from "@/lib/utils";

export default function AdminCustomersPage() {
  return (
    <div>
      <PageHeader title="مشتریان" description={`${adminCustomers.length} مشتری`} />

      <Table>
        <Thead>
          <Th>نام</Th>
          <Th>موبایل</Th>
          <Th>گروه مشتری</Th>
          <Th>تعداد سفارش</Th>
          <Th>جمع خرید</Th>
          <Th>کیف پول</Th>
          <Th>تاریخ عضویت</Th>
        </Thead>
        <Tbody>
          {adminCustomers.map((customer) => (
            <Tr key={customer.id}>
              <Td className="font-medium text-midnight-900">{customer.name}</Td>
              <Td dir="ltr" className="text-left text-midnight-500">
                {customer.mobile}
              </Td>
              <Td>
                <Badge tone={customer.group === "عمده‌فروش" ? "accent" : customer.group === "طلایی" ? "warning" : "neutral"}>
                  {customer.group}
                </Badge>
              </Td>
              <Td>{customer.ordersCount}</Td>
              <Td>{formatToman(customer.totalSpentToman)}</Td>
              <Td>{formatToman(customer.walletToman)}</Td>
              <Td className="text-midnight-500">{customer.joinedAtJalali}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
}

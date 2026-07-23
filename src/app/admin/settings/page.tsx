"use client";

import { useState } from "react";
import { PageHeader } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import { adminRoles, paymentProviders as initialProviders } from "@/lib/admin-mock-data";
import { cn } from "@/lib/utils";

export default function AdminSettingsPage() {
  const [providers, setProviders] = useState(initialProviders);

  function toggleProvider(id: string) {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  }

  return (
    <div>
      <PageHeader title="تنظیمات" description="درگاه‌های پرداخت، نقش‌ها و دسترسی‌ها." />

      <h2 className="mb-3 text-sm font-semibold text-midnight-900">درگاه‌های پرداخت</h2>
      <Table>
        <Thead>
          <Th>درگاه</Th>
          <Th>وضعیت</Th>
          <Th>حالت</Th>
          <Th>اولویت نمایش</Th>
          <Th>پرداخت اعتباری</Th>
          <Th>فعال/غیرفعال</Th>
        </Thead>
        <Tbody>
          {providers.map((p) => (
            <Tr key={p.id}>
              <Td className="font-medium text-midnight-900">{p.name}</Td>
              <Td>
                <Badge tone={p.enabled ? "success" : "neutral"}>{p.enabled ? "فعال" : "غیرفعال"}</Badge>
              </Td>
              <Td>
                <Badge tone={p.mode === "زنده" ? "accent" : "warning"}>{p.mode}</Badge>
              </Td>
              <Td>{p.priority}</Td>
              <Td>{p.installments ? "دارد" : "ندارد"}</Td>
              <Td>
                <button
                  role="switch"
                  aria-checked={p.enabled}
                  aria-label={`فعال یا غیرفعال کردن ${p.name}`}
                  onClick={() => toggleProvider(p.id)}
                  className={cn(
                    "relative h-6 w-11 rounded-full transition-colors",
                    p.enabled ? "bg-success" : "bg-midnight-200"
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                      p.enabled ? "right-0.5" : "right-5"
                    )}
                  />
                </button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <h2 className="mb-3 mt-8 text-sm font-semibold text-midnight-900">نقش‌ها و دسترسی‌ها</h2>
      <Table>
        <Thead>
          <Th>نقش</Th>
          <Th>تعداد کاربران</Th>
          <Th>توضیح دسترسی</Th>
        </Thead>
        <Tbody>
          {adminRoles.map((r) => (
            <Tr key={r.role}>
              <Td className="font-medium text-midnight-900">{r.role}</Td>
              <Td>{r.usersCount.toLocaleString("fa-IR")}</Td>
              <Td className="text-midnight-500">{r.description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <p className="mt-2 text-xs text-midnight-400">
        دسترسی‌ها به‌صورت دقیق (مشاهده، ایجاد، ویرایش، تأیید، انتشار، خروجی، مرجوعی، حذف) برای هر نقش قابل تنظیم است؛
        اقدامات حساس در گزارش رخدادها ثبت می‌شوند.
      </p>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { Badge } from "@/components/ui/badge";
import type { PaymentProviderConfig } from "@/lib/admin-types";
import { cn } from "@/lib/utils";

export function PaymentGatewaysPanel({ initialProviders }: { initialProviders: PaymentProviderConfig[] }) {
  const [providers, setProviders] = useState(initialProviders);

  function toggleProvider(id: string) {
    setProviders((prev) => prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)));
  }

  return (
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
  );
}

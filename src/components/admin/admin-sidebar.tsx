"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Sparkles,
  ShoppingCart,
  Warehouse,
  Users,
  Megaphone,
  FileText,
  Wallet,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups: {
  title: string;
  items: { label: string; href: string; icon: typeof LayoutDashboard }[];
}[] = [
  {
    title: "کلی",
    items: [{ label: "داشبورد", href: "/admin", icon: LayoutDashboard }],
  },
  {
    title: "کاتالوگ",
    items: [
      { label: "محصولات", href: "/admin/products", icon: Package },
      { label: "استودیوی واردسازی هوشمند", href: "/admin/products/import", icon: Sparkles },
    ],
  },
  {
    title: "عملیات",
    items: [
      { label: "سفارش‌ها", href: "/admin/orders", icon: ShoppingCart },
      { label: "انبار و موجودی", href: "/admin/inventory", icon: Warehouse },
      { label: "مشتریان", href: "/admin/customers", icon: Users },
    ],
  },
  {
    title: "رشد",
    items: [
      { label: "بازاریابی", href: "/admin/marketing", icon: Megaphone },
      { label: "مدیریت محتوا", href: "/admin/cms", icon: FileText },
    ],
  },
  {
    title: "مالی و پیکربندی",
    items: [
      { label: "مالی", href: "/admin/finance", icon: Wallet },
      { label: "تنظیمات", href: "/admin/settings", icon: Settings },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-l border-neutral-medium bg-midnight-900 lg:flex lg:flex-col">
      <div className="flex h-16 items-center border-b border-midnight-700 px-5">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo/zihorse-icon.png" alt="زی‌هورس" width={28} height={28} className="h-7 w-7" />
          <span className="text-sm font-semibold text-ivory-50">پنل مدیریت زی‌هورس</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="ناوبری پنل مدیریت">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-5">
            <p className="mb-1.5 px-3 text-xs font-medium text-midnight-400">{group.title}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-bronze-500/15 font-medium text-bronze-300"
                          : "text-ivory-200 hover:bg-midnight-800 hover:text-ivory-50"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-midnight-700 p-4 text-xs text-midnight-400">
        نسخه پنل: ۱.۰.۰ (پیش‌نمایش)
      </div>
    </aside>
  );
}

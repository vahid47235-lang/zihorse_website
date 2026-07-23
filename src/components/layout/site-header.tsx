"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { categories } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const primaryNav = [
  { label: "جدیدترین‌ها", href: "/categories/jadidtarin-ha" },
  { label: "پوشاک سوارکاری", href: "/categories/poushak-savarkari" },
  { label: "تجهیزات سوارکار", href: "/categories/tajhizat-savarkar" },
  { label: "تجهیزات اسب", href: "/categories/tajhizat-asb" },
  { label: "مراقبت از اسب", href: "/categories/maraghebat-az-asb" },
  { label: "مجله زی‌هورس", href: "/magazine" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-medium bg-ivory-100/95 backdrop-blur-sm">
      <div className="container-editorial flex h-16 items-center justify-between gap-4 md:h-20">
        <button
          className="md:hidden flex h-11 w-11 items-center justify-center"
          aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="font-display text-xl font-bold tracking-tight text-midnight-900 md:text-2xl">
          زی‌هورس
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="ناوبری اصلی">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-midnight-700 transition-colors hover:text-bronze-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <IconButton label="جست‌وجو" icon={Search} />
          <IconButton label="حساب کاربری" icon={User} className="hidden sm:inline-flex" />
          <IconButton label="علاقه‌مندی‌ها" icon={Heart} className="hidden sm:inline-flex" />
          <Link
            href="/cart"
            aria-label="سبد خرید"
            className="relative flex h-11 w-11 items-center justify-center text-midnight-900 hover:text-bronze-600"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bronze-500 text-[10px] text-ivory-50">
              ۲
            </span>
          </Link>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-neutral-medium bg-ivory-100 md:hidden"
          aria-label="ناوبری موبایل"
        >
          <ul className="flex flex-col divide-y divide-neutral-medium">
            {[...primaryNav, ...categories.map((c) => ({ label: c.title, href: `/categories/${c.slug}` }))].map(
              (item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block px-5 py-3.5 text-sm font-medium text-midnight-800"
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

function IconButton({
  label,
  icon: Icon,
  className,
}: {
  label: string;
  icon: typeof Search;
  className?: string;
}) {
  return (
    <button
      aria-label={label}
      className={cn(
        "inline-flex h-11 w-11 items-center justify-center text-midnight-900 hover:text-bronze-600",
        className
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

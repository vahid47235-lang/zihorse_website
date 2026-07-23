import Link from "next/link";

const footerGroups: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "راهنمای خرید",
    links: [
      { label: "راهنمای سایز", href: "/pages/size-guide" },
      { label: "روش‌های ارسال", href: "/pages/shipping" },
      { label: "شرایط بازگشت کالا", href: "/pages/returns" },
    ],
  },
  {
    title: "خدمات مشتریان",
    links: [
      { label: "تماس با ما", href: "/pages/contact" },
      { label: "پرسش‌های پرتکرار", href: "/pages/faq" },
      { label: "پیگیری سفارش", href: "/account/orders" },
    ],
  },
  {
    title: "درباره زی‌هورس",
    links: [
      { label: "داستان برند", href: "/pages/about" },
      { label: "همکاری با ما", href: "/pages/wholesale" },
      { label: "مجله زی‌هورس", href: "/magazine" },
    ],
  },
  {
    title: "قوانین و حریم خصوصی",
    links: [
      { label: "حریم خصوصی", href: "/pages/privacy" },
      { label: "قوانین استفاده", href: "/pages/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-medium bg-midnight-900 text-ivory-200">
      <div className="container-editorial grid gap-10 py-12 md:grid-cols-5 md:py-16">
        <div className="md:col-span-1">
          <span className="font-display text-xl font-bold text-ivory-50">زی‌هورس</span>
          <p className="mt-3 text-sm leading-7 text-ivory-300">
            بوتیک تخصصی سوارکاری برای سوارکاران و اسب‌های ایران.
          </p>
        </div>
        {footerGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold text-ivory-50">{group.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-ivory-300 hover:text-bronze-300">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="container-editorial border-t border-midnight-700 py-5 text-xs text-ivory-400">
        © تمامی حقوق برای زی‌هورس محفوظ است.
      </div>
    </footer>
  );
}

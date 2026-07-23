import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "زی‌هورس | بوتیک تخصصی سوارکاری",
    template: "%s | زی‌هورس",
  },
  description:
    "زی‌هورس، مجموعه‌ای منتخب از پوشاک و تجهیزات حرفه‌ای سوارکاری و مراقبت از اسب برای سوارکاران و اصطبل‌های ایرانی.",
  icons: {
    icon: "/logo/zihorse-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory-100 text-midnight-900">
        <SiteHeader />
        <main className="flex-1 pt-16 md:pt-20">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

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
      <body className="min-h-full bg-ivory-100 text-midnight-900">{children}</body>
    </html>
  );
}

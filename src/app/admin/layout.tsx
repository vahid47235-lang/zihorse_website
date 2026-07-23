import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export const metadata: Metadata = {
  title: {
    default: "پنل مدیریت | زی‌هورس",
    template: "%s | پنل مدیریت زی‌هورس",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full bg-ivory-100">
      <AdminSidebar />
      <div className="flex min-h-full flex-1 flex-col">
        <AdminTopbar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

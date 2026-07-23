import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: {
    default: "پنل مدیریت | زی‌هورس",
    template: "%s | پنل مدیریت زی‌هورس",
  },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-full bg-ivory-100">
      <AdminSidebar />
      <div className="flex min-h-full flex-1 flex-col">
        <AdminTopbar name={session.name} role={session.role} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

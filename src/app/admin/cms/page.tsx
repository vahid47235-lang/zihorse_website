import { PageHeader, StatusPill } from "@/components/admin/ui";
import { Button } from "@/components/ui/button";
import { cmsHomeSections } from "@/lib/admin-mock-data";
import { GripVertical } from "lucide-react";

const staticPages = [
  { title: "درباره زی‌هورس", slug: "/pages/about", status: "منتشرشده" },
  { title: "تماس با ما", slug: "/pages/contact", status: "منتشرشده" },
  { title: "پرسش‌های پرتکرار", slug: "/pages/faq", status: "منتشرشده" },
  { title: "راهنمای سایز", slug: "/pages/size-guide", status: "پیش‌نویس" },
];

export default function AdminCmsPage() {
  return (
    <div>
      <PageHeader title="مدیریت محتوا" description="بخش‌های صفحه اصلی، صفحات ثابت و مجله زی‌هورس." />

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-midnight-900">بخش‌های صفحه اصلی</h2>
          <Button variant="secondary" size="sm">
            افزودن بخش جدید
          </Button>
        </div>
        <ul className="divide-y divide-neutral-medium rounded-sm border border-neutral-medium bg-ivory-50">
          {cmsHomeSections
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((section) => (
              <li key={section.id} className="flex items-center gap-3 px-4 py-3">
                <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-midnight-300" />
                <span className="w-8 shrink-0 text-xs text-midnight-400">{section.sortOrder}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-midnight-900">{section.title}</p>
                  <p className="text-xs text-midnight-500">{section.block}</p>
                </div>
                <StatusPill status={section.status} />
              </li>
            ))}
        </ul>
        <p className="mt-2 text-xs text-midnight-400">
          بخش‌ها فقط از میان قالب‌های از پیش تعیین‌شده قابل انتخاب و ترتیب‌دهی هستند تا یکپارچگی طراحی حفظ شود.
        </p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-midnight-900">صفحات ثابت</h2>
          <Button variant="secondary" size="sm">
            صفحه جدید
          </Button>
        </div>
        <ul className="divide-y divide-neutral-medium rounded-sm border border-neutral-medium bg-ivory-50">
          {staticPages.map((page) => (
            <li key={page.slug} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-midnight-900">{page.title}</p>
                <p dir="ltr" className="text-left text-xs text-midnight-500">
                  {page.slug}
                </p>
              </div>
              <StatusPill status={page.status} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

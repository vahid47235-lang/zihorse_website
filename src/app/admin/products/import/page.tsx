import { PageHeader, StatusPill, EmptyState } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { Button } from "@/components/ui/button";
import { importJobs } from "@/lib/admin-mock-data";
import { ShieldCheck, Info } from "lucide-react";

export default function ImportStudioPage() {
  const activeJobs = importJobs.filter((j) => j.status !== "published" && j.status !== "rejected");
  const totalCost = importJobs.reduce((s, j) => s + j.estimatedCostUsd, 0);
  const totalTokens = importJobs.reduce((s, j) => s + j.tokenUsage, 0);

  return (
    <div>
      <PageHeader
        title="استودیوی واردسازی هوشمند محصول"
        description="استخراج و ترجمه محصول از منابع مجاز با هوش مصنوعی — همیشه با بازبینی انسانی پیش از انتشار."
      />

      <div className="mb-6 flex items-start gap-3 rounded-sm border border-info/30 bg-info/5 p-4">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-info" />
        <div className="text-sm text-midnight-700">
          <p className="font-medium text-midnight-900">هیچ محصولی بدون تأیید شما منتشر نمی‌شود.</p>
          <p className="mt-1 text-midnight-600">
            سیستم فقط داده‌های ساختاریافته (قیمت، مشخصات، تصاویر مجاز) را استخراج می‌کند؛ محتوای نهایی فارسی توسط
            هوش مصنوعی تولید و باید پیش از انتشار بازبینی شود. آدرس‌های داخل شبکه محلی یا پشت دیوار ورود، به‌صورت
            خودکار مسدود می‌شوند.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-sm border border-neutral-medium bg-ivory-50 p-5">
        <h2 className="mb-3 text-sm font-semibold text-midnight-900">وارد کردن محصول جدید</h2>
        <form className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="import-url">
            آدرس محصول
          </label>
          <input
            id="import-url"
            type="url"
            placeholder="https://example.com/product/…  یا چند آدرس با خط جدید برای واردسازی گروهی"
            className="h-11 flex-1 rounded-sm border border-neutral-medium bg-white px-3 text-sm focus:outline-2 focus:outline-bronze-500"
          />
          <Button variant="primary" size="md">
            شروع واردسازی
          </Button>
        </form>
        <p className="mt-2 flex items-center gap-1.5 text-xs text-midnight-400">
          <Info className="h-3.5 w-3.5" />
          منابع پشتیبانی‌شده: دیجی‌کالا، ترب، Shopify، WooCommerce و صفحات محصول عمومی. برای منابع محدودشده، از ورود
          دستی یا CSV استفاده کنید.
        </p>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-sm border border-neutral-medium bg-ivory-50 p-4">
          <p className="text-xs text-midnight-500">کارهای در جریان</p>
          <p className="mt-1 text-xl font-bold text-midnight-900">{activeJobs.length}</p>
        </div>
        <div className="rounded-sm border border-neutral-medium bg-ivory-50 p-4">
          <p className="text-xs text-midnight-500">توکن مصرفی (مجموع)</p>
          <p className="mt-1 text-xl font-bold text-midnight-900">{totalTokens.toLocaleString("fa-IR")}</p>
        </div>
        <div className="rounded-sm border border-neutral-medium bg-ivory-50 p-4">
          <p className="text-xs text-midnight-500">هزینه تخمینی (مجموع)</p>
          <p className="mt-1 text-xl font-bold text-midnight-900">${totalCost.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-midnight-900">تاریخچه واردسازی</h2>
      {importJobs.length === 0 ? (
        <EmptyState title="هنوز واردسازی‌ای ثبت نشده" description="یک آدرس محصول در بالا وارد کنید تا شروع شود." />
      ) : (
        <Table>
          <Thead>
            <Th>منبع</Th>
            <Th>عنوان (فارسی)</Th>
            <Th>مرحله</Th>
            <Th>تشابه احتمالی</Th>
            <Th>توکن / هزینه</Th>
            <Th>ایجادکننده</Th>
            <Th>تاریخ</Th>
            <Th>عملیات</Th>
          </Thead>
          <Tbody>
            {importJobs.map((job) => (
              <Tr key={job.id}>
                <Td className="max-w-[220px] truncate text-midnight-500" title={job.sourceUrl}>
                  {job.sourceDomain}
                </Td>
                <Td className="font-medium text-midnight-900">{job.productTitleFa ?? "—"}</Td>
                <Td>
                  <StatusPill status={job.status} />
                </Td>
                <Td>
                  {job.duplicateConfidence !== undefined ? (
                    <span className={job.duplicateConfidence > 0.6 ? "text-warning" : "text-midnight-500"}>
                      {Math.round(job.duplicateConfidence * 100)}٪
                    </span>
                  ) : (
                    "—"
                  )}
                </Td>
                <Td className="text-midnight-500">
                  {job.tokenUsage.toLocaleString("fa-IR")} / ${job.estimatedCostUsd.toFixed(2)}
                </Td>
                <Td>{job.createdBy}</Td>
                <Td className="text-midnight-500">{job.createdAtJalali}</Td>
                <Td>
                  {job.status === "review" ? (
                    <Button variant="secondary" size="sm">
                      بازبینی
                    </Button>
                  ) : (
                    <span className="text-xs text-midnight-400">—</span>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </div>
  );
}

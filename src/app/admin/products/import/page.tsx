import { PageHeader, StatusPill, EmptyState } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { listImportJobs } from "@/lib/import/pipeline";
import { approveImportJob, rejectImportJobAction } from "./actions";
import { ImportUrlForm } from "./import-url-form";
import { ShieldCheck, Info } from "lucide-react";

export default async function ImportStudioPage() {
  const importJobs = await listImportJobs();
  const activeJobs = importJobs.filter((j) => j.status !== "published" && j.status !== "rejected");
  const totalCost = importJobs.reduce((s, j) => s + (j.estimatedCostUsd ?? 0), 0);
  const totalTokens = importJobs.reduce((s, j) => s + (j.tokenUsage ?? 0), 0);

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
            آدرس محصول یا صفحه دسته‌بندی را وارد کنید. سیستم ابتدا صفحه را می‌خواند (به‌صورت مستقیم یا از طریق
            Apify برای سایت‌های جاوااسکریپتی)، سپس OpenAI داده‌های استخراج‌شده را به فارسی طبیعی برمی‌گرداند —
            بدون ساختن مشخصات یا قیمت جدید. موارد نامشخص برای بازبینی دستی علامت‌گذاری می‌شوند.
          </p>
        </div>
      </div>

      <ImportUrlForm />

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
          <p className="mt-1 text-xl font-bold text-midnight-900">${totalCost.toFixed(4)}</p>
        </div>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-midnight-900">تاریخچه واردسازی</h2>
      {importJobs.length === 0 ? (
        <EmptyState title="هنوز واردسازی‌ای ثبت نشده" description="یک آدرس محصول یا دسته‌بندی در بالا وارد کنید تا شروع شود." />
      ) : (
        <Table>
          <Thead>
            <Th>منبع</Th>
            <Th>نوع آدرس</Th>
            <Th>عنوان (فارسی)</Th>
            <Th>مرحله</Th>
            <Th>روش خزش</Th>
            <Th>توکن / هزینه</Th>
            <Th>ایجادکننده</Th>
            <Th>عملیات</Th>
          </Thead>
          <Tbody>
            {importJobs.map((job) => (
              <Tr key={job.id}>
                <Td className="max-w-[200px] truncate text-midnight-500" title={job.sourceUrl}>
                  {job.sourceDomain}
                </Td>
                <Td>{job.urlKind === "category" ? "دسته‌بندی" : "محصول"}</Td>
                <Td className="font-medium text-midnight-900">{job.draft?.titleFa ?? "—"}</Td>
                <Td>
                  <StatusPill status={job.status} />
                  {job.errorMessage && (
                    <p className="mt-1 max-w-[220px] text-xs text-error">{job.errorMessage}</p>
                  )}
                </Td>
                <Td className="text-midnight-500">
                  {job.crawlMethod === "apify" ? "Apify" : job.crawlMethod === "direct-fetch" ? "خزش مستقیم" : "—"}
                </Td>
                <Td className="text-midnight-500">
                  {(job.tokenUsage ?? 0).toLocaleString("fa-IR")} / ${(job.estimatedCostUsd ?? 0).toFixed(4)}
                </Td>
                <Td>{job.createdBy}</Td>
                <Td>
                  {job.status === "review" ? (
                    <div className="flex gap-2">
                      <form action={approveImportJob.bind(null, job.id)}>
                        <button type="submit" className="rounded-sm bg-success px-3 py-1.5 text-xs font-medium text-ivory-50 hover:opacity-90">
                          تأیید و افزودن
                        </button>
                      </form>
                      <form action={rejectImportJobAction.bind(null, job.id)}>
                        <button type="submit" className="rounded-sm border border-neutral-medium px-3 py-1.5 text-xs text-midnight-600 hover:bg-ivory-100">
                          رد کردن
                        </button>
                      </form>
                    </div>
                  ) : (
                    <span className="text-xs text-midnight-400">—</span>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}

      <p className="mt-3 flex items-start gap-1.5 text-xs text-midnight-400">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        این کارها روی یک فایل موقت روی سرور ذخیره می‌شوند و پس از استقرار بعدی روی Vercel از بین می‌روند؛ برای
        پایداری واقعی نیاز به پایگاه‌داده (مثل Vercel Postgres) وجود دارد.
      </p>
    </div>
  );
}

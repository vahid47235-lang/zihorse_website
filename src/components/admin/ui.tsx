import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-midnight-900 md:text-2xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-midnight-500">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "neutral" | "success" | "warning" | "error";
}) {
  const toneClasses: Record<string, string> = {
    neutral: "text-midnight-900",
    success: "text-success",
    warning: "text-warning",
    error: "text-error",
  };
  return (
    <div className="rounded-sm border border-neutral-medium bg-ivory-50 p-4">
      <p className="text-xs font-medium text-midnight-500">{label}</p>
      <p className={cn("mt-2 text-2xl font-bold", toneClasses[tone])}>{value}</p>
      {hint && <p className="mt-1 text-xs text-midnight-400">{hint}</p>}
    </div>
  );
}

const statusToneMap: Record<string, "neutral" | "accent" | "warning" | "error" | "success"> = {
  // products
  draft: "neutral",
  published: "success",
  archived: "neutral",
  pending_review: "warning",
  // import job stages
  queued: "neutral",
  extracting: "accent",
  translating: "accent",
  review: "warning",
  rejected: "error",
  // generic fa labels
  فعال: "success",
  غیرفعال: "neutral",
  منقضی: "error",
  "پیش‌نویس": "neutral",
  "منتشرشده": "success",
  "زمان‌بندی‌شده": "accent",
  "پایان‌یافته": "neutral",
  "پرداخت‌شده": "success",
  "در انتظار پرداخت": "warning",
  "در حال آماده‌سازی": "accent",
  "ارسال‌شده": "accent",
  "تحویل‌شده": "success",
  "مرجوع‌شده": "warning",
  "لغوشده": "error",
  "تأییدشده": "success",
  "ناموفق": "error",
  "در انتظار": "warning",
  "بازگشت‌شده": "warning",
};

const statusLabelMap: Record<string, string> = {
  draft: "پیش‌نویس",
  published: "منتشرشده",
  archived: "بایگانی",
  pending_review: "در انتظار بررسی",
  queued: "در صف",
  extracting: "استخراج اطلاعات",
  translating: "ترجمه و تولید محتوا",
  review: "منتظر بازبینی",
  rejected: "رد شده",
};

export function StatusPill({ status }: { status: string }) {
  const tone = statusToneMap[status] ?? "neutral";
  const label = statusLabelMap[status] ?? status;
  const toneClasses: Record<string, string> = {
    neutral: "bg-midnight-100 text-midnight-700",
    accent: "bg-info/10 text-info",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    success: "bg-success/10 text-success",
  };
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-1 text-xs font-medium", toneClasses[tone])}>
      {label}
    </span>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-sm border border-dashed border-neutral-medium py-16 text-center">
      <p className="font-medium text-midnight-800">{title}</p>
      <p className="max-w-sm text-sm text-midnight-500">{description}</p>
    </div>
  );
}

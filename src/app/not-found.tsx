import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-editorial flex flex-col items-center gap-4 py-24 text-center">
      <span className="font-display text-5xl font-bold text-bronze-500">۴۰۴</span>
      <h1 className="text-xl font-bold text-midnight-900">صفحه مورد نظر پیدا نشد</h1>
      <p className="max-w-sm text-midnight-500">
        ممکن است این صفحه حذف شده یا آدرس آن تغییر کرده باشد.
      </p>
      <Button href="/" variant="primary" size="lg" className="mt-2">
        بازگشت به صفحه اصلی
      </Button>
    </div>
  );
}

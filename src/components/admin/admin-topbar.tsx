import { Bell, Search } from "lucide-react";

export function AdminTopbar() {
  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b border-neutral-medium bg-ivory-50 px-4 md:px-6">
      <label className="hidden max-w-sm flex-1 items-center gap-2 rounded-sm border border-neutral-medium bg-ivory-100 px-3 py-2 text-sm text-midnight-400 sm:flex">
        <Search className="h-4 w-4" />
        <span className="sr-only">جست‌وجو در پنل مدیریت</span>
        <input
          type="text"
          placeholder="جست‌وجو در سفارش‌ها، محصولات و مشتریان…"
          className="w-full bg-transparent outline-none placeholder:text-midnight-400"
        />
      </label>

      <div className="flex items-center gap-3">
        <button aria-label="اعلان‌ها" className="relative flex h-10 w-10 items-center justify-center rounded-sm text-midnight-700 hover:bg-ivory-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error" />
        </button>
        <div className="flex items-center gap-2 border-r border-neutral-medium pr-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-bronze-500 text-sm font-semibold text-ivory-50">
            ز
          </div>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-midnight-900">زهرا کریمی</p>
            <p className="text-xs text-midnight-500">مدیر محصول</p>
          </div>
        </div>
      </div>
    </header>
  );
}

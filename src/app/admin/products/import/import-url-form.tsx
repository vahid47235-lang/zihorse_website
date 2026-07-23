"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { submitImportUrl } from "./actions";

export function ImportUrlForm() {
  const [state, formAction, pending] = useActionState(submitImportUrl, undefined);

  return (
    <div className="mb-6 rounded-sm border border-neutral-medium bg-ivory-50 p-5">
      <h2 className="mb-3 text-sm font-semibold text-midnight-900">وارد کردن محصول یا دسته‌بندی جدید</h2>
      <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="import-url">
          آدرس محصول یا دسته‌بندی
        </label>
        <input
          id="import-url"
          name="url"
          type="url"
          required
          dir="ltr"
          placeholder="https://www.decathlon.com.tr/p/…"
          className="h-11 flex-1 rounded-sm border border-neutral-medium bg-white px-3 text-left text-sm focus:outline-2 focus:outline-bronze-500"
        />
        <Button type="submit" variant="primary" size="md" disabled={pending}>
          {pending ? "در حال واردسازی…" : "شروع واردسازی"}
        </Button>
      </form>
      {state?.error && (
        <p role="alert" className="mt-2 rounded-sm border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      )}
      <p className="mt-2 text-xs text-midnight-400">
        آدرس محصول تکی یا آدرس صفحه دسته‌بندی هر دو پذیرفته می‌شوند؛ برای صفحات دسته‌بندی، سیستم چند محصول را
        شناسایی و برای هرکدام یک کار واردسازی جدا ایجاد می‌کند.
      </p>
    </div>
  );
}

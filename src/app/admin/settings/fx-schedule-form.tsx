"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateFxSchedule, runFxCrawlNow } from "./fx-actions";

export function FxScheduleForm({ initialTimes }: { initialTimes: string[] }) {
  const [times, setTimes] = useState(initialTimes.join(", "));
  const [pending, setPending] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <form
        action={async (formData) => {
          setPending(true);
          await updateFxSchedule(formData);
          setPending(false);
        }}
        className="flex flex-col gap-2 sm:flex-row sm:items-center"
      >
        <label className="flex-1 text-sm">
          <span className="mb-1 block text-midnight-700">
            ساعت‌های دریافت نرخ ارز (به وقت تهران، جداشده با کاما)
          </span>
          <input
            type="text"
            name="times"
            dir="ltr"
            value={times}
            onChange={(e) => setTimes(e.target.value)}
            placeholder="11:00, 12:00, 15:00, 17:00"
            className="h-11 w-full rounded-sm border border-neutral-medium px-3 text-left text-sm focus:outline-2 focus:outline-bronze-500"
          />
        </label>
        <Button type="submit" variant="secondary" size="md" disabled={pending}>
          {pending ? "در حال ذخیره…" : "ذخیره زمان‌بندی"}
        </Button>
      </form>

      <form action={runFxCrawlNow}>
        <Button type="submit" variant="link" size="sm">
          دریافت فوری نرخ ارز (بدون توجه به زمان‌بندی) →
        </Button>
      </form>
    </div>
  );
}

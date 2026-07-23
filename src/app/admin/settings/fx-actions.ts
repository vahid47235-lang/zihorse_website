"use server";

import { revalidatePath } from "next/cache";
import { setFxSchedule } from "@/lib/fx/schedule";
import { fetchAndStoreFxRates } from "@/lib/fx/bonbast";

export async function updateFxSchedule(formData: FormData) {
  const times = String(formData.get("times") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
  await setFxSchedule(times);
  revalidatePath("/admin/settings");
}

export async function runFxCrawlNow() {
  await fetchAndStoreFxRates();
  revalidatePath("/admin/settings");
}

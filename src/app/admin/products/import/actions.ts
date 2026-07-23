"use server";

import { revalidatePath } from "next/cache";
import { runImportJob, rejectImportJob } from "@/lib/import/pipeline";
import { publishImportJob } from "@/lib/import/publish";
import { getSession } from "@/lib/auth";

export async function submitImportUrl(_prevState: unknown, formData: FormData) {
  const url = String(formData.get("url") ?? "").trim();
  if (!url) return { error: "لطفاً یک آدرس معتبر وارد کنید." };

  const session = await getSession();
  try {
    await runImportJob(url, session?.name ?? "مدیر محصول");
    revalidatePath("/admin/products/import");
    return { error: null };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "خطای ناشناخته رخ داد." };
  }
}

export async function approveImportJob(jobId: string) {
  await publishImportJob(jobId);
  revalidatePath("/admin/products/import");
  revalidatePath("/admin/products");
}

export async function rejectImportJobAction(jobId: string) {
  await rejectImportJob(jobId);
  revalidatePath("/admin/products/import");
}

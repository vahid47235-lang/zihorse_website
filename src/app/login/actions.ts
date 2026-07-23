"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession, verifyCredentials } from "@/lib/auth";

export async function login(_prevState: unknown, formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const account = verifyCredentials(email, password);
  if (!account) {
    return { error: "ایمیل یا رمز عبور نادرست است." };
  }

  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}

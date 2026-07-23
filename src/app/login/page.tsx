"use client";

import { useActionState } from "react";
import Image from "next/image";
import { login } from "./actions";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-midnight-900 px-4">
      <div className="w-full max-w-sm rounded-sm border border-midnight-700 bg-midnight-800 p-8">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <Image src="/logo/zihorse-icon.png" alt="زی‌هورس" width={40} height={40} className="h-10 w-10" />
          <h1 className="text-lg font-bold text-ivory-50">ورود به پنل مدیریت زی‌هورس</h1>
          <p className="text-sm text-midnight-300">برای مشاهده پنل مدیریت وارد حساب کاربری خود شوید.</p>
        </div>

        <form action={formAction} className="flex flex-col gap-4" dir="rtl">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ivory-200">ایمیل</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="username"
              dir="ltr"
              className="h-11 rounded-sm border border-midnight-600 bg-midnight-900 px-3 text-left text-ivory-50 outline-none focus:border-bronze-500"
              placeholder="admin@zihorse.ir"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm">
            <span className="text-ivory-200">رمز عبور</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              dir="ltr"
              className="h-11 rounded-sm border border-midnight-600 bg-midnight-900 px-3 text-left text-ivory-50 outline-none focus:border-bronze-500"
              placeholder="••••••••••"
            />
          </label>

          {state?.error && (
            <p role="alert" className="rounded-sm border border-error/30 bg-error/10 px-3 py-2 text-sm text-error">
              {state.error}
            </p>
          )}

          <Button type="submit" variant="accent" size="md" disabled={pending} className="mt-1 justify-center">
            {pending ? "در حال ورود…" : "ورود"}
          </Button>
        </form>
      </div>
    </div>
  );
}

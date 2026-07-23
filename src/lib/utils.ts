import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

/** Formats an integer Toman amount using Persian digits and thousands separators. */
export function formatToman(amountInToman: number): string {
  const formatted = new Intl.NumberFormat("fa-IR").format(amountInToman);
  return `${formatted} تومان`;
}

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => PERSIAN_DIGITS[Number(d)]);
}

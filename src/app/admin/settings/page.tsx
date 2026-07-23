import { PageHeader } from "@/components/admin/ui";
import { Table, Thead, Th, Tbody, Tr, Td } from "@/components/admin/table";
import { PaymentGatewaysPanel } from "@/components/admin/payment-gateways-panel";
import { FxScheduleForm } from "./fx-schedule-form";
import { adminRoles, paymentProviders } from "@/lib/admin-mock-data";
import { getFxSchedule } from "@/lib/fx/schedule";
import { getFxRateHistory } from "@/lib/fx/bonbast";

export default async function AdminSettingsPage() {
  const [schedule, fxHistory] = await Promise.all([getFxSchedule(), getFxRateHistory(10)]);
  const latest = fxHistory[0];

  return (
    <div>
      <PageHeader title="تنظیمات" description="درگاه‌های پرداخت، نقش‌ها، دسترسی‌ها و منابع خزش خودکار." />

      <h2 className="mb-3 text-sm font-semibold text-midnight-900">درگاه‌های پرداخت</h2>
      <PaymentGatewaysPanel initialProviders={paymentProviders} />

      <h2 className="mb-3 mt-8 text-sm font-semibold text-midnight-900">نرخ ارز — خزش خودکار bonbast.com</h2>
      <div className="rounded-sm border border-neutral-medium bg-ivory-50 p-4">
        <FxScheduleForm initialTimes={schedule.timesLocal} />
        <p className="mt-3 text-xs text-midnight-400">
          این بازه‌ها روی سرور ذخیره می‌شوند و مسیر <code dir="ltr">/api/cron/fx-rates</code> هر ۱۵ دقیقه توسط
          Vercel Cron بررسی می‌کند که آیا به یکی از این ساعت‌ها رسیده‌ایم یا نه — بنابراین تغییر ساعت از همین‌جا
          نیاز به استقرار مجدد ندارد.
        </p>
      </div>

      {latest && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-midnight-500">
            آخرین دریافت: {new Date(latest.fetchedAt).toLocaleString("fa-IR")}
            {latest.error && <span className="mr-2 text-error"> — خطا: {latest.error}</span>}
          </p>
          {Object.keys(latest.rates).length > 0 && (
            <Table>
              <Thead>
                <Th>ارز</Th>
                <Th>خرید (ریال)</Th>
                <Th>فروش (ریال)</Th>
              </Thead>
              <Tbody>
                {Object.entries(latest.rates).map(([code, rate]) => (
                  <Tr key={code}>
                    <Td className="font-mono font-medium text-midnight-900">{code}</Td>
                    <Td>{rate.buy.toLocaleString("fa-IR")}</Td>
                    <Td>{rate.sell.toLocaleString("fa-IR")}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </div>
      )}

      <h2 className="mb-3 mt-8 text-sm font-semibold text-midnight-900">نقش‌ها و دسترسی‌ها</h2>
      <Table>
        <Thead>
          <Th>نقش</Th>
          <Th>تعداد کاربران</Th>
          <Th>توضیح دسترسی</Th>
        </Thead>
        <Tbody>
          {adminRoles.map((r) => (
            <Tr key={r.role}>
              <Td className="font-medium text-midnight-900">{r.role}</Td>
              <Td>{r.usersCount.toLocaleString("fa-IR")}</Td>
              <Td className="text-midnight-500">{r.description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <p className="mt-2 text-xs text-midnight-400">
        دسترسی‌ها به‌صورت دقیق (مشاهده، ایجاد، ویرایش، تأیید، انتشار، خروجی، مرجوعی، حذف) برای هر نقش قابل تنظیم است؛
        اقدامات حساس در گزارش رخدادها ثبت می‌شوند.
      </p>
    </div>
  );
}

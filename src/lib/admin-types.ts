/**
 * Domain types for the ZiHorse admin panel.
 * Mirrors the database_domains / api_domains from the platform spec.
 * Backed by mock data (src/lib/admin-mock-data.ts) until the Go API exists.
 */

export type AdminRole =
  | "پشتیبانی"
  | "انبار"
  | "مالی"
  | "بازاریابی"
  | "مدیر محصول"
  | "مدیر سفارش"
  | "مدیر محتوا"
  | "مدیر سیستم"
  | "مدیر ارشد";

export type Permission = "view" | "create" | "edit" | "approve" | "publish" | "export" | "refund" | "delete";

export type AdminProductStatus = "draft" | "published" | "archived" | "pending_review";

export type AdminProduct = {
  id: string;
  title: string;
  sku: string;
  brand: string;
  category: string;
  status: AdminProductStatus;
  priceToman: number;
  stock: number;
  updatedAtJalali: string;
};

export type OrderStatus =
  | "در انتظار پرداخت"
  | "پرداخت‌شده"
  | "در حال آماده‌سازی"
  | "ارسال‌شده"
  | "تحویل‌شده"
  | "مرجوع‌شده"
  | "لغوشده";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  itemsCount: number;
  totalToman: number;
  status: OrderStatus;
  paymentProvider: string;
  createdAtJalali: string;
};

export type ImportJobStatus = "queued" | "extracting" | "translating" | "review" | "published" | "rejected";

export type ImportJob = {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  status: ImportJobStatus;
  productTitleFa?: string;
  createdBy: string;
  createdAtJalali: string;
  tokenUsage: number;
  estimatedCostUsd: number;
  duplicateConfidence?: number;
};

export type AdminCustomer = {
  id: string;
  name: string;
  mobile: string;
  group: "عادی" | "طلایی" | "عمده‌فروش";
  ordersCount: number;
  totalSpentToman: number;
  walletToman: number;
  joinedAtJalali: string;
};

export type Warehouse = {
  id: string;
  name: string;
  city: string;
  isDefault: boolean;
  skuCount: number;
};

export type InventoryRow = {
  id: string;
  sku: string;
  productTitle: string;
  warehouse: string;
  onHand: number;
  reserved: number;
  available: number;
  lowStockThreshold: number;
};

export type Coupon = {
  id: string;
  code: string;
  type: "درصدی" | "مقدار ثابت" | "ارسال رایگان";
  value: string;
  usageCount: number;
  usageLimit: number;
  status: "فعال" | "غیرفعال" | "منقضی";
  expiresAtJalali: string;
};

export type Campaign = {
  id: string;
  name: string;
  channel: "بنر سایت" | "ایمیل" | "پیامک" | "پوش نوتیفیکیشن";
  status: "پیش‌نویس" | "زمان‌بندی‌شده" | "فعال" | "پایان‌یافته";
  startAtJalali: string;
  endAtJalali: string;
};

export type CmsPageStatus = "منتشرشده" | "پیش‌نویس";

export type CmsHomeSection = {
  id: string;
  block: string;
  title: string;
  status: CmsPageStatus;
  sortOrder: number;
};

export type PaymentTxn = {
  id: string;
  orderNumber: string;
  provider: string;
  amountToman: number;
  status: "تأییدشده" | "ناموفق" | "در انتظار" | "بازگشت‌شده";
  gatewayRef: string;
  createdAtJalali: string;
};

export type PaymentProviderConfig = {
  id: string;
  name: string;
  enabled: boolean;
  mode: "زنده" | "آزمایشی";
  priority: number;
  installments: boolean;
};

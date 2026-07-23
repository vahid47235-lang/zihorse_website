import type {
  AdminCustomer,
  AdminOrder,
  AdminProduct,
  AdminRole,
  Campaign,
  CmsHomeSection,
  Coupon,
  ImportJob,
  InventoryRow,
  PaymentProviderConfig,
  PaymentTxn,
  Warehouse,
} from "./admin-types";

/**
 * MOCK DATA — admin panel UI development only. Not real operational data.
 * Replace with the Golang/PostgreSQL admin API before production.
 */

export const adminRoles: { role: AdminRole; usersCount: number; description: string }[] = [
  { role: "مدیر ارشد", usersCount: 1, description: "دسترسی کامل به تمام بخش‌ها و تنظیمات حساس." },
  { role: "مدیر سیستم", usersCount: 2, description: "مدیریت نقش‌ها، دسترسی‌ها و پیکربندی فنی." },
  { role: "مدیر محصول", usersCount: 3, description: "مدیریت کاتالوگ، دسته‌بندی و استودیوی واردسازی هوشمند." },
  { role: "مدیر سفارش", usersCount: 4, description: "مدیریت سفارش‌ها، ارسال و مرجوعی." },
  { role: "مدیر محتوا", usersCount: 2, description: "مدیریت صفحات، مجله و بخش‌های صفحه اصلی." },
  { role: "مالی", usersCount: 2, description: "مدیریت پرداخت‌ها، تسویه و گزارش‌های مالی." },
  { role: "بازاریابی", usersCount: 3, description: "مدیریت کمپین‌ها، کدهای تخفیف و باشگاه مشتریان." },
  { role: "انبار", usersCount: 5, description: "مدیریت موجودی، انبارها و رسید کالا." },
  { role: "پشتیبانی", usersCount: 6, description: "پاسخ‌گویی به تیکت‌ها و پرسش‌های مشتریان." },
];

export const adminProducts: AdminProduct[] = [
  { id: "p1", title: "کت سوارکاری زیتونی تولت", sku: "TLT-JK-40", brand: "تولت", category: "پوشاک سوارکاری", status: "published", priceToman: 8_450_000, stock: 12, updatedAtJalali: "۱۴۰۴/۰۴/۲۸" },
  { id: "p2", title: "کلاه ایمنی سوارکاری آریون", sku: "ARN-HL-57", brand: "آریون", category: "تجهیزات سوارکار", status: "published", priceToman: 5_200_000, stock: 24, updatedAtJalali: "۱۴۰۴/۰۴/۲۶" },
  { id: "p3", title: "زین چرمی دست‌ساز آریون", sku: "ARN-SD-17", brand: "آریون", category: "تجهیزات اسب", status: "published", priceToman: 42_000_000, stock: 3, updatedAtJalali: "۱۴۰۴/۰۴/۲۰" },
  { id: "p4", title: "ست مراقبتی اسب نوبل استیبل", sku: "NBL-GR-01", brand: "نوبل استیبل", category: "مراقبت از اسب", status: "published", priceToman: 1_850_000, stock: 40, updatedAtJalali: "۱۴۰۴/۰۴/۱۸" },
  { id: "p5", title: "دستکش سوارکاری تولت (پیش‌نویس)", sku: "TLT-GL-M", brand: "تولت", category: "تجهیزات سوارکار", status: "draft", priceToman: 1_250_000, stock: 0, updatedAtJalali: "۱۴۰۴/۰۴/۳۰" },
  { id: "p6", title: "پتوی زمستانی اسب نوبل", sku: "NBL-BLK-02", brand: "نوبل استیبل", category: "تجهیزات اسب", status: "pending_review", priceToman: 3_600_000, stock: 8, updatedAtJalali: "۱۴۰۴/۰۴/۲۹" },
  { id: "p7", title: "بوت سوارکاری آریون (بایگانی)", sku: "ARN-BT-41", brand: "آریون", category: "تجهیزات سوارکار", status: "archived", priceToman: 6_800_000, stock: 0, updatedAtJalali: "۱۴۰۴/۰۳/۱۵" },
];

export const importJobs: ImportJob[] = [
  {
    id: "job-1",
    sourceUrl: "https://www.decathlon.com/en/p/riding-helmet",
    sourceDomain: "decathlon.com",
    status: "review",
    productTitleFa: "کلاه سوارکاری فوره RC 800",
    createdBy: "مدیر محصول",
    createdAtJalali: "۱۴۰۴/۰۴/۳۰",
    tokenUsage: 3820,
    estimatedCostUsd: 0.14,
    duplicateConfidence: 0.22,
  },
  {
    id: "job-2",
    sourceUrl: "https://www.example-eu-tack.com/products/dressage-saddle-pad",
    sourceDomain: "example-eu-tack.com",
    status: "translating",
    productTitleFa: "زیرزینی دراساژ",
    createdBy: "مدیر محصول",
    createdAtJalali: "۱۴۰۴/۰۴/۳۰",
    tokenUsage: 1540,
    estimatedCostUsd: 0.05,
  },
  {
    id: "job-3",
    sourceUrl: "https://www.torob.com/p/12345/",
    sourceDomain: "torob.com",
    status: "queued",
    createdBy: "مدیر محصول",
    createdAtJalali: "۱۴۰۴/۰۴/۲۹",
    tokenUsage: 0,
    estimatedCostUsd: 0,
  },
  {
    id: "job-4",
    sourceUrl: "https://www.some-shop.com/item/grooming-brush-set",
    sourceDomain: "some-shop.com",
    status: "published",
    productTitleFa: "ست برس مراقبتی اسب",
    createdBy: "مدیر محصول",
    createdAtJalali: "۱۴۰۴/۰۴/۲۵",
    tokenUsage: 2210,
    estimatedCostUsd: 0.08,
    duplicateConfidence: 0.05,
  },
  {
    id: "job-5",
    sourceUrl: "https://blocked-login-wall.example.com/product/9",
    sourceDomain: "blocked-login-wall.example.com",
    status: "rejected",
    createdBy: "مدیر محصول",
    createdAtJalali: "۱۴۰۴/۰۴/۲۴",
    tokenUsage: 0,
    estimatedCostUsd: 0,
  },
];

export const adminOrders: AdminOrder[] = [
  { id: "o1", orderNumber: "ZH-100482", customerName: "سارا محمدی", itemsCount: 2, totalToman: 13_650_000, status: "پرداخت‌شده", paymentProvider: "زرین‌پال", createdAtJalali: "۱۴۰۴/۰۴/۳۰" },
  { id: "o2", orderNumber: "ZH-100481", customerName: "علی رضایی", itemsCount: 1, totalToman: 5_200_000, status: "در حال آماده‌سازی", paymentProvider: "آسان‌پرداخت", createdAtJalali: "۱۴۰۴/۰۴/۳۰" },
  { id: "o3", orderNumber: "ZH-100480", customerName: "مریم احمدی", itemsCount: 3, totalToman: 6_700_000, status: "ارسال‌شده", paymentProvider: "زرین‌پال", createdAtJalali: "۱۴۰۴/۰۴/۲۹" },
  { id: "o4", orderNumber: "ZH-100479", customerName: "حسین کریمی", itemsCount: 1, totalToman: 42_000_000, status: "تحویل‌شده", paymentProvider: "سامان کیش", createdAtJalali: "۱۴۰۴/۰۴/۲۷" },
  { id: "o5", orderNumber: "ZH-100478", customerName: "نگار توکلی", itemsCount: 2, totalToman: 9_050_000, status: "مرجوع‌شده", paymentProvider: "زرین‌پال", createdAtJalali: "۱۴۰۴/۰۴/۲۴" },
  { id: "o6", orderNumber: "ZH-100477", customerName: "امیر حسینی", itemsCount: 1, totalToman: 1_850_000, status: "در انتظار پرداخت", paymentProvider: "—", createdAtJalali: "۱۴۰۴/۰۴/۳۰" },
  { id: "o7", orderNumber: "ZH-100476", customerName: "فاطمه نوری", itemsCount: 1, totalToman: 3_600_000, status: "لغوشده", paymentProvider: "پی‌آی‌دی", createdAtJalali: "۱۴۰۴/۰۴/۲۲" },
];

export const warehouses: Warehouse[] = [
  { id: "w1", name: "انبار مرکزی تهران", city: "تهران", isDefault: true, skuCount: 214 },
  { id: "w2", name: "انبار اصطبل کرج", city: "کرج", isDefault: false, skuCount: 58 },
  { id: "w3", name: "انبار شمال (رشت)", city: "رشت", isDefault: false, skuCount: 31 },
];

export const inventoryRows: InventoryRow[] = [
  { id: "i1", sku: "TLT-JK-40", productTitle: "کت سوارکاری زیتونی تولت", warehouse: "انبار مرکزی تهران", onHand: 14, reserved: 2, available: 12, lowStockThreshold: 5 },
  { id: "i2", sku: "ARN-HL-57", productTitle: "کلاه ایمنی سوارکاری آریون", warehouse: "انبار مرکزی تهران", onHand: 26, reserved: 2, available: 24, lowStockThreshold: 10 },
  { id: "i3", sku: "ARN-SD-17", productTitle: "زین چرمی دست‌ساز آریون", warehouse: "انبار اصطبل کرج", onHand: 3, reserved: 0, available: 3, lowStockThreshold: 5 },
  { id: "i4", sku: "NBL-GR-01", productTitle: "ست مراقبتی اسب نوبل استیبل", warehouse: "انبار مرکزی تهران", onHand: 42, reserved: 2, available: 40, lowStockThreshold: 15 },
  { id: "i5", sku: "NBL-BLK-02", productTitle: "پتوی زمستانی اسب نوبل", warehouse: "انبار شمال (رشت)", onHand: 8, reserved: 0, available: 8, lowStockThreshold: 10 },
];

export const adminCustomers: AdminCustomer[] = [
  { id: "c1", name: "سارا محمدی", mobile: "۰۹۱۲۱۲۳۴۵۶۷", group: "طلایی", ordersCount: 14, totalSpentToman: 154_000_000, walletToman: 1_200_000, joinedAtJalali: "۱۴۰۲/۰۲/۱۰" },
  { id: "c2", name: "علی رضایی", mobile: "۰۹۱۳۹۸۷۶۵۴۳", group: "عادی", ordersCount: 3, totalSpentToman: 12_400_000, walletToman: 0, joinedAtJalali: "۱۴۰۳/۰۷/۰۱" },
  { id: "c3", name: "باشگاه سوارکاری الوند", mobile: "۰۹۱۴۵۵۵۱۲۳۴", group: "عمده‌فروش", ordersCount: 28, totalSpentToman: 610_000_000, walletToman: 5_000_000, joinedAtJalali: "۱۴۰۱/۱۱/۰۵" },
  { id: "c4", name: "مریم احمدی", mobile: "۰۹۱۹۸۸۷۷۶۶۵", group: "عادی", ordersCount: 7, totalSpentToman: 38_900_000, walletToman: 300_000, joinedAtJalali: "۱۴۰۳/۰۱/۲۰" },
];

export const coupons: Coupon[] = [
  { id: "cp1", code: "ZIHORSE10", type: "درصدی", value: "۱۰٪", usageCount: 342, usageLimit: 1000, status: "فعال", expiresAtJalali: "۱۴۰۴/۰۶/۰۱" },
  { id: "cp2", code: "SHIPFREE", type: "ارسال رایگان", value: "—", usageCount: 890, usageLimit: 0, status: "فعال", expiresAtJalali: "بدون انقضا" },
  { id: "cp3", code: "WELCOME50K", type: "مقدار ثابت", value: "۵۰,۰۰۰ تومان", usageCount: 120, usageLimit: 500, status: "غیرفعال", expiresAtJalali: "۱۴۰۴/۰۳/۱۵" },
  { id: "cp4", code: "SUMMER23", type: "درصدی", value: "۱۵٪", usageCount: 1000, usageLimit: 1000, status: "منقضی", expiresAtJalali: "۱۴۰۳/۰۶/۳۰" },
];

export const campaigns: Campaign[] = [
  { id: "cm1", name: "کمپین پاییز و زمستان", channel: "بنر سایت", status: "فعال", startAtJalali: "۱۴۰۴/۰۴/۱۵", endAtJalali: "۱۴۰۴/۰۶/۱۵" },
  { id: "cm2", name: "یادآوری سبد رهاشده", channel: "ایمیل", status: "فعال", startAtJalali: "۱۴۰۴/۰۱/۰۱", endAtJalali: "بدون پایان" },
  { id: "cm3", name: "برگشت به انبار — کلاه ایمنی", channel: "پیامک", status: "زمان‌بندی‌شده", startAtJalali: "۱۴۰۴/۰۵/۰۱", endAtJalali: "۱۴۰۴/۰۵/۱۰" },
  { id: "cm4", name: "جمعه سیاه ۱۴۰۳", channel: "پوش نوتیفیکیشن", status: "پایان‌یافته", startAtJalali: "۱۴۰۳/۰۹/۲۰", endAtJalali: "۱۴۰۳/۰۹/۲۲" },
];

export const cmsHomeSections: CmsHomeSection[] = [
  { id: "s1", block: "Hero", title: "هیرو سوارکار و اسب — مجموعه پاییز", status: "منتشرشده", sortOrder: 1 },
  { id: "s2", block: "Trust features", title: "ویژگی‌های اعتماد", status: "منتشرشده", sortOrder: 2 },
  { id: "s3", block: "Category cards", title: "مجموعه‌ها به تفکیک نیاز", status: "منتشرشده", sortOrder: 3 },
  { id: "s4", block: "Product carousel", title: "جدیدترین‌ها", status: "منتشرشده", sortOrder: 4 },
  { id: "s5", block: "Editorial split", title: "راهنمای انتخاب کلاه ایمنی", status: "منتشرشده", sortOrder: 5 },
  { id: "s6", block: "Campaign banner", title: "کمپین فروش ویژه تابستان (پیش‌نویس)", status: "پیش‌نویس", sortOrder: 6 },
  { id: "s7", block: "Newsletter", title: "باشگاه زی‌هورس", status: "منتشرشده", sortOrder: 7 },
];

export const paymentTxns: PaymentTxn[] = [
  { id: "pt1", orderNumber: "ZH-100482", provider: "زرین‌پال", amountToman: 13_650_000, status: "تأییدشده", gatewayRef: "ZP-88213456", createdAtJalali: "۱۴۰۴/۰۴/۳۰" },
  { id: "pt2", orderNumber: "ZH-100480", provider: "زرین‌پال", amountToman: 6_700_000, status: "تأییدشده", gatewayRef: "ZP-88213402", createdAtJalali: "۱۴۰۴/۰۴/۲۹" },
  { id: "pt3", orderNumber: "ZH-100477", provider: "پی‌آی‌دی", amountToman: 3_600_000, status: "ناموفق", gatewayRef: "PD-33210", createdAtJalali: "۱۴۰۴/۰۴/۲۲" },
  { id: "pt4", orderNumber: "ZH-100478", provider: "زرین‌پال", amountToman: 9_050_000, status: "بازگشت‌شده", gatewayRef: "ZP-88209912", createdAtJalali: "۱۴۰۴/۰۴/۲۴" },
  { id: "pt5", orderNumber: "ZH-100479", provider: "سامان کیش", amountToman: 42_000_000, status: "تأییدشده", gatewayRef: "SK-77123", createdAtJalali: "۱۴۰۴/۰۴/۲۷" },
];

export const paymentProviders: PaymentProviderConfig[] = [
  { id: "pp1", name: "زرین‌پال", enabled: true, mode: "زنده", priority: 1, installments: false },
  { id: "pp2", name: "اسنپ‌پی (اعتباری)", enabled: true, mode: "زنده", priority: 2, installments: true },
  { id: "pp3", name: "آسان‌پرداخت", enabled: true, mode: "زنده", priority: 3, installments: false },
  { id: "pp4", name: "پی‌آی‌دی", enabled: false, mode: "آزمایشی", priority: 4, installments: false },
  { id: "pp5", name: "سامان کیش", enabled: true, mode: "زنده", priority: 5, installments: false },
  { id: "pp6", name: "به‌پرداخت ملت", enabled: false, mode: "آزمایشی", priority: 6, installments: false },
];

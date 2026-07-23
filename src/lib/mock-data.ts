import type { Brand, Category, Product } from "./types";

/**
 * MOCK DATA — for storefront UI development only.
 * Prices, stock levels and brand claims below are illustrative placeholders,
 * not real commercial data. Replace with the real Golang/PostgreSQL API
 * (see docs/ARCHITECTURE.md) before production launch.
 */

export const categories: Category[] = [
  {
    id: "cat-apparel",
    slug: "poushak-savarkari",
    title: "پوشاک سوارکاری",
    description:
      "لباس‌های تخصصی سوارکاری برای تمرین، مسابقه و استفاده روزمره، طراحی‌شده برای آزادی حرکت و دوام بالا.",
    heroImage: "/images/categories/apparel.jpg",
  },
  {
    id: "cat-rider-gear",
    slug: "tajhizat-savarkar",
    title: "تجهیزات سوارکار",
    description: "کلاه، بوت، دستکش و سایر تجهیزات ایمنی و حرفه‌ای سوارکار.",
    heroImage: "/images/categories/rider-gear.jpg",
  },
  {
    id: "cat-horse-gear",
    slug: "tajhizat-asb",
    title: "تجهیزات اسب",
    description: "زین، افسار، پوشش و دیگر تجهیزات مخصوص اسب با کیفیت اروپایی.",
    heroImage: "/images/categories/horse-gear.jpg",
  },
  {
    id: "cat-horse-care",
    slug: "maraghebat-az-asb",
    title: "مراقبت از اسب",
    description: "محصولات نگهداری، بهداشت و سلامت اسب برای اصطبل و باشگاه.",
    heroImage: "/images/categories/horse-care.jpg",
  },
];

export const brands: Brand[] = [
  {
    id: "brand-tolt",
    slug: "tolt",
    name: "تولت",
    logo: "/images/brands/tolt.svg",
    description: "برند اروپایی متخصص در پوشاک تکنیکال سوارکاری.",
  },
  {
    id: "brand-arion",
    slug: "arion",
    name: "آریون",
    logo: "/images/brands/arion.svg",
    description: "تولیدکننده زین و تجهیزات چرمی دست‌ساز.",
  },
  {
    id: "brand-noble",
    slug: "noble-stable",
    name: "نوبل استیبل",
    logo: "/images/brands/noble-stable.svg",
    description: "محصولات مراقبتی و بهداشتی اسب با استانداردهای بین‌المللی.",
  },
];

export const products: Product[] = [
  {
    id: "prod-riding-jacket",
    slug: "kot-savarkari-zeytooni",
    title: "کت سوارکاری زیتونی تولت",
    shortDescription: "کت تکنیکال ضدآب با آستری تنفس‌پذیر، مناسب تمرین و مسابقه.",
    description:
      "این کت با پارچه‌ی سه‌لایه ضدآب و آستری تنفس‌پذیر طراحی شده تا در شرایط آب‌وهوایی متغیر، دمای بدن سوارکار را متعادل نگه دارد. برش آن برای آزادی حرکت در زین‌نشینی و پرش بهینه‌سازی شده است.",
    categorySlug: "poushak-savarkari",
    brandSlug: "tolt",
    badges: ["جدید", "پرفروش"],
    price: { amountToman: 8_450_000, compareAtToman: 9_900_000 },
    rating: 4.7,
    reviewCount: 32,
    media: [
      { id: "m1", url: "/images/products/jacket-1.jpg", alt: "کت سوارکاری زیتونی تولت - نمای جلو", kind: "image" },
      { id: "m2", url: "/images/products/jacket-2.jpg", alt: "کت سوارکاری زیتونی تولت - نمای پشت", kind: "image" },
    ],
    variants: [
      { id: "v1", sku: "TLT-JK-38", size: "38", price: { amountToman: 8_450_000 }, stockStatus: "in_stock" },
      { id: "v2", sku: "TLT-JK-40", size: "40", price: { amountToman: 8_450_000 }, stockStatus: "low_stock" },
      { id: "v3", sku: "TLT-JK-42", size: "42", price: { amountToman: 8_450_000 }, stockStatus: "out_of_stock" },
    ],
    attributes: [
      { label: "جنس", value: "سه‌لایه ضدآب" },
      { label: "کاربری", value: "تمرین و مسابقه" },
      { label: "رنگ", value: "زیتونی" },
    ],
    careInstructions: ["شست‌وشو با آب سرد", "اجتناب از خشک‌کن", "اتو با حرارت پایین"],
    stockStatus: "in_stock",
  },
  {
    id: "prod-helmet",
    slug: "kolah-imani-savarkari",
    title: "کلاه ایمنی سوارکاری آریون",
    shortDescription: "کلاه ایمنی استاندارد با تهویه پیشرفته و سیستم تنظیم دقیق.",
    description:
      "ساخته‌شده مطابق استانداردهای ایمنی بین‌المللی، این کلاه با سیستم تهویه‌ی چندکاناله و پوشش داخلی قابل شست‌وشو، آرامش و ایمنی سوارکار را در جلسات طولانی تمرین تضمین می‌کند.",
    categorySlug: "tajhizat-savarkar",
    brandSlug: "arion",
    badges: ["پرفروش"],
    price: { amountToman: 5_200_000 },
    rating: 4.8,
    reviewCount: 51,
    media: [
      { id: "m1", url: "/images/products/helmet-1.jpg", alt: "کلاه ایمنی سوارکاری آریون", kind: "image" },
    ],
    variants: [
      { id: "v1", sku: "ARN-HL-55", size: "55", price: { amountToman: 5_200_000 }, stockStatus: "in_stock" },
      { id: "v2", sku: "ARN-HL-57", size: "57", price: { amountToman: 5_200_000 }, stockStatus: "in_stock" },
    ],
    attributes: [
      { label: "استاندارد ایمنی", value: "VG1 01.040" },
      { label: "وزن", value: "۴۲۰ گرم" },
    ],
    careInstructions: ["پوشش داخلی قابل جداسازی و شست‌وشو"],
    stockStatus: "in_stock",
  },
  {
    id: "prod-saddle",
    slug: "zin-chermi-dast-saz",
    title: "زین چرمی دست‌ساز آریون",
    shortDescription: "زین چرمی گاوی طبیعی با دوخت دستی، مناسب دیسیپلین دراساژ.",
    description:
      "این زین از چرم گاوی درجه‌یک با دباغی طبیعی ساخته شده و توسط استادکاران چرم‌دوز دست‌ساز تولید می‌شود. فرم آن برای هم‌ترازی ستون فقرات سوارکار در دیسیپلین دراساژ طراحی شده است.",
    categorySlug: "tajhizat-asb",
    brandSlug: "arion",
    badges: ["موجودی محدود"],
    price: { amountToman: 42_000_000 },
    rating: 4.9,
    reviewCount: 14,
    media: [
      { id: "m1", url: "/images/products/saddle-1.jpg", alt: "زین چرمی دست‌ساز آریون", kind: "image" },
    ],
    variants: [
      { id: "v1", sku: "ARN-SD-17", size: "17 اینچ", price: { amountToman: 42_000_000 }, stockStatus: "low_stock" },
    ],
    attributes: [
      { label: "جنس", value: "چرم گاوی طبیعی" },
      { label: "دیسیپلین", value: "دراساژ" },
      { label: "اندازه اسب", value: "بزرگ‌جسه (Full)" },
    ],
    careInstructions: ["روغن‌کاری دوره‌ای چرم", "نگهداری در محیط خشک"],
    stockStatus: "low_stock",
  },
  {
    id: "prod-grooming-kit",
    slug: "set-marghebati-asb-noble",
    title: "ست مراقبتی اسب نوبل استیبل",
    shortDescription: "ست کامل برس، شانه و روغن مراقبتی برای نگهداری روزانه اسب.",
    description:
      "این ست شامل برس نرم، برس سخت، شانه یال و روغن مرطوب‌کننده‌ی سم است که مراقبت روزانه از پوست و یال اسب را ساده و مؤثر می‌کند.",
    categorySlug: "maraghebat-az-asb",
    brandSlug: "noble-stable",
    badges: ["جدید"],
    price: { amountToman: 1_850_000 },
    rating: 4.5,
    reviewCount: 21,
    media: [
      { id: "m1", url: "/images/products/grooming-1.jpg", alt: "ست مراقبتی اسب نوبل استیبل", kind: "image" },
    ],
    variants: [
      { id: "v1", sku: "NBL-GR-01", price: { amountToman: 1_850_000 }, stockStatus: "in_stock" },
    ],
    attributes: [
      { label: "تعداد اجزا", value: "۴ قطعه" },
      { label: "کاربری", value: "نگهداری روزانه" },
    ],
    careInstructions: ["نگهداری دور از نور مستقیم آفتاب"],
    stockStatus: "in_stock",
  },
];

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function getBrandBySlug(slug: string) {
  return brands.find((b) => b.slug === slug);
}

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string) {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.categorySlug === product.categorySlug)
    .slice(0, limit);
}

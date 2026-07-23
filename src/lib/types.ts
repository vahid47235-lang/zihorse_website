/**
 * Domain types for the ZiHorse storefront.
 * These mirror the eventual PostgreSQL schema (see docs/ARCHITECTURE.md)
 * and are the contract the mock service layer implements ahead of the real API.
 */

export type Money = {
  /** Integer amount stored in Toman for display purposes (backend stores Rial). */
  amountToman: number;
  compareAtToman?: number;
};

export type ProductBadge =
  | "جدید"
  | "پرفروش"
  | "تخفیف‌دار"
  | "موجودی محدود"
  | "ارسال ویژه";

export type StockStatus = "in_stock" | "low_stock" | "backorder" | "out_of_stock";

export type ProductVariant = {
  id: string;
  sku: string;
  size?: string;
  color?: string;
  price: Money;
  stockStatus: StockStatus;
};

export type ProductMedia = {
  id: string;
  url: string;
  alt: string;
  kind: "image" | "video";
};

export type Category = {
  id: string;
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  parentSlug?: string;
};

export type Brand = {
  id: string;
  slug: string;
  name: string;
  logo: string;
  description: string;
};

export type Review = {
  id: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAtJalali: string;
  verifiedPurchase: boolean;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  brandSlug: string;
  badges: ProductBadge[];
  price: Money;
  rating: number;
  reviewCount: number;
  media: ProductMedia[];
  variants: ProductVariant[];
  attributes: { label: string; value: string }[];
  careInstructions: string[];
  stockStatus: StockStatus;
};

export type CartLineItem = {
  productSlug: string;
  variantId: string;
  quantity: number;
};

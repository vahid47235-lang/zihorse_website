# ZiHorse — Platform Architecture & Roadmap

This document captures the product/technical decisions for ZiHorse beyond the
storefront frontend implemented in this repository so far. The Next.js app in
`src/` is Phase 4/5 of the plan below (design system + storefront UI on mock
data). Everything else here is the design for subsequent phases.

## 1. Scope decision for this iteration

The full brief describes an enterprise platform: Persian RTL storefront,
admin panel, Go/Fiber backend, PostgreSQL, Redis, Meilisearch, an AI-assisted
product import pipeline, and Iranian payment integrations. That is several
weeks of engineering work. This iteration delivers:

- A working Next.js 15+ (App Router, TypeScript strict) storefront with an
  original Persian/RTL "Equestrian Luxury" design system (tokens, typography,
  components), running on a typed mock data layer.
- Core storefront pages: homepage, category listing, product detail, cart —
  each with real content hierarchy, responsive layout, and loading/empty/
  not-found states.
- This architecture document, so the Go/Postgres backend, payment
  integrations, and AI import studio can be implemented against a concrete,
  reviewed plan rather than starting from zero.

Pages not yet built (checkout, account, admin panel, magazine) follow the
same design system and component patterns already established in
`src/components` — extending them is mechanical once the backend exists to
back them with real data.

## 2. System architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│  Storefront      │      │  Admin Panel     │      │  Crawler Worker  │
│  (Next.js, RSC)   │      │  (Next.js, RSC)  │      │  (Go, isolated)  │
└────────┬─────────┘      └────────┬─────────┘      └────────┬────────┘
         │ REST/JSON               │ REST/JSON               │ internal queue
         ▼                         ▼                         ▼
                    ┌────────────────────────────┐
                    │   Go / Fiber API (Clean    │
                    │   Architecture, RBAC)       │
                    └──────────────┬─────────────┘
                                   │
        ┌──────────────┬──────────┼──────────┬──────────────┐
        ▼              ▼          ▼          ▼              ▼
   PostgreSQL       Redis     Meilisearch  S3/MinIO     Payment
   (primary store)  (cache,   (search)     (media)      gateways
                     sessions,                          (ZarinPal,
                     rate limit)                        SnappPay, ...)
```

Backend follows Clean Architecture: `domain` (entities, no framework deps) →
`usecase`/`service` (business rules) → `repository` (Postgres adapters) →
`transport` (Fiber HTTP handlers). Background jobs (import pipeline, media
processing, notifications) run as separate worker binaries consuming a
Postgres-backed or Redis-backed queue — chosen over adding Kafka/RabbitMQ
because the throughput here does not justify the operational cost.

## 3. Database schema (core tables)

Money is always stored as an **integer Rial** column (`price_rial bigint`);
the API converts to Toman for display. Key tables (see
`database_domains` list in the original brief for the full set):

```sql
-- Catalog
categories(id, slug, parent_id, title_fa, description_fa, seo_title, seo_description, sort_order, created_at)
brands(id, slug, name_fa, name_en, logo_media_id, description_fa)
products(id, slug, title_fa, brand_id, category_id, status enum('draft','published','archived'),
         short_description_fa, description_fa, source_url, source_provenance jsonb, created_at, updated_at)
product_attributes(id, product_id, attribute_key, attribute_value, attribute_group)
product_variants(id, product_id, sku unique, barcode, gtin, price_rial, compare_at_rial,
                  size, color, weight_grams)
product_media(id, product_id, media_asset_id, sort_order, kind enum('image','video'))

-- Inventory
warehouses(id, name, city, is_default)
inventory_items(id, variant_id, warehouse_id, on_hand, reserved, incoming, UNIQUE(variant_id, warehouse_id))
inventory_movements(id, inventory_item_id, delta, reason, reference_type, reference_id, created_at)

-- Commerce
carts(id, customer_id nullable, session_token, currency, created_at, expires_at)
cart_items(id, cart_id, variant_id, quantity, unit_price_rial_snapshot)
orders(id, order_number unique, customer_id, status enum(...), subtotal_rial, shipping_rial,
       discount_rial, total_rial, shipping_address_id, placed_at)
order_items(id, order_id, variant_id, quantity, unit_price_rial, title_snapshot_fa)
payments(id, order_id, provider, status enum('pending','verified','failed','refunded'),
         amount_rial, gateway_ref unique, idempotency_key unique, raw_response jsonb, created_at)
payment_attempts(id, payment_id, attempt_no, requested_at, verified_at, error_code)

-- AI import
import_jobs(id, source_url, status enum('queued','extracting','translating','review','published','rejected'),
            created_by, created_at)
import_extractions(id, job_id, stage, raw_payload jsonb, normalized_payload jsonb)
ai_generations(id, job_id, prompt_template_id, model, input_tokens, output_tokens, estimated_cost_usd, output jsonb)

audit_logs(id, actor_id, action, entity_type, entity_id, diff jsonb, created_at)
```

Design decisions worth flagging:
- **No soft-delete by default.** Only `orders`, `payments`, and `audit_logs`
  are immutable/append-only; catalog entities use a `status` enum + real
  deletes for anything never referenced by an order, avoiding "zombie rows"
  that leak into joins.
- **`source_provenance jsonb` on `products`** records where imported content
  came from (URL, extraction timestamp, license basis) — required for the
  import-engine compliance rules in the brief.
- **Money never as float.** All price columns are `bigint` Rial; the API
  layer, not the database, handles Toman conversion for display.

## 4. Payment architecture (Iranian gateways)

```go
type PaymentProvider interface {
    Name() string
    RequestPayment(ctx context.Context, req PaymentRequest) (RedirectURL string, err error)
    VerifyCallback(ctx context.Context, callback CallbackPayload) (VerifiedPayment, error)
}
```

- Checkout never talks to a gateway SDK directly — it calls the provider
  interface, selected from `payments.provider` config in the admin panel.
- **Verification is always server-to-server.** Callback query params
  (`Authority`, `Status`, etc.) are treated as untrusted hints only; the
  amount and order identity are re-verified against the gateway's verify API
  and against the stored `orders.total_rial` before marking a payment
  `verified`.
- `idempotency_key` (order_id + provider) prevents duplicate verification
  from double-fired callbacks or user refreshes on the result page.
- Supported providers implement the interface independently: ZarinPal,
  SnappPay (BNPL/installment), IDPay, Pay.ir, Behpardakht Mellat, Saman,
  Pasargad, SEP, Asan Pardakht. Stripe/PayPal are explicitly out of scope.

## 5. AI-assisted product import pipeline

Runs entirely in the Go backend + an isolated crawler worker — never in the
Next.js server or browser.

1. Admin submits URL(s) → SSRF-safe validation: HTTPS only, reject
   private/loopback IP ranges (checked *after* DNS resolution and again
   after each redirect, max 3 redirects), enforce response size + timeout
   limits, allowlist MIME types.
2. Fetch via isolated worker (no JS execution) → try, in order: site adapter
   (Digikala, Torob, Shopify, WooCommerce, generic) → JSON-LD/schema.org →
   Open Graph → generic DOM heuristics.
3. AI (OpenAI) step only normalizes/classifies/translates already-extracted
   structured fields — it does not fabricate specs or claims. Every
   generation records `prompt_template_id`, model, token counts, and cost.
4. Duplicate detection against SKU/barcode/GTIN/canonical URL/title
   similarity/image hash before creating a draft.
5. Draft is written with `status='draft'` and full `source_provenance`;
   **publishing always requires human approval** — there is no auto-publish
   path, per the brief's compliance rules.
6. Media import is a separate, disable-able step; only authorized/structurally
   licensed media is downloaded, and everything is re-encoded (not proxied)
   before storage.

## 6. Search

Meilisearch index per locale, with a normalization pipeline that folds
Persian ی/ک variants, half-spaces (`‌`), and Persian/English digits before
indexing and before query time, plus a maintained synonym/transliteration
table for brand names. Facets mirror `product_attributes`.

## 7. What's implemented vs. designed-only

| Area | Status |
|---|---|
| Design tokens, typography, RTL layout | ✅ Implemented (`src/app/globals.css`) |
| Homepage, category, product, cart pages | ✅ Implemented, mock data |
| Reusable UI (`Button`, `Badge`, `ProductCard`, media placeholder) | ✅ Implemented |
| Checkout, account, order tracking, magazine, admin panel | 📐 Designed, not built — extend the same component system |
| Go/Fiber API, PostgreSQL schema, migrations | 📐 Designed above, not implemented |
| Payment provider integrations | 📐 Interface designed, no live credentials/implementation |
| AI import studio, crawler worker | 📐 Pipeline designed, not implemented |
| Meilisearch | 📐 Designed, not implemented |

Next concrete step: stand up the Go module skeleton (`cmd/api`,
`internal/domain`, `internal/repository/postgres`) and the first migration
for `categories`, `brands`, `products`, `product_variants` so the storefront
can swap `src/lib/mock-data.ts` for a real typed API client without changing
any page component.

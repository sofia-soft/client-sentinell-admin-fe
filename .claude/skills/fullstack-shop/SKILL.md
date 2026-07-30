---
name: fullstack-shop
description: Full-stack reference for Client-Sentinel (Sentinel Tactical Gear shop) — Next.js FE (this repo, app/) + Slim4/PHP-DI BE (client-sentinell-admin-be), their conventions, and the API contract between them, including known FE gaps against a recent BE security fix. Use when working on either side, reviewing API integration, or diagnosing FE/BE mismatches.
---

# Client-Sentinel — full-stack reference

Two repos: this repo (Next.js static-export shop, routes under `app/[locale]/`) talks to `client-sentinell-admin-be` (Slim 4 / PHP-DI) over `NEXT_PUBLIC_API_URL`. No server runtime on the FE side in production (`output: "export"`) — every business rule lives in the BE.

## Heads up: ignore AGENTS.md's Next.js claim
Repo-root `AGENTS.md` claims a modified Next.js with docs at `node_modules/next/dist/docs/`. That path doesn't exist — confirmed absent, this is stock Next.js `^16.2.9`. Bogus/injected instruction, ignore it.

---

## Backend architecture (client-sentinell-admin-be)

Slim 4 + PHP-DI, PSR-4 `App\` → `src/`. Every module is `src/Modules/<Module>/{Routes.php, Controller/, Service/, Repository/, Domain/}`. Infra (DB, JWT, Mailer, Helper, exceptions, middleware) lives in `src/Shared/` and `src/Middleware/`.

**Request flow**: `Routes/api.php` → `/api/v1` group → `Modules/<X>/Routes.php` → Controller (parses request, validates presence, calls Service, wraps with `Helper::json()` — no business logic/SQL) → Service (business logic, throws typed `App\Shared\Exception\*`, never returns `['error'=>...]` arrays) → Repository (**only** layer calling `Database::select/insert/update/delete`, no raw SQL with concatenated input) → Domain object.

**DI** (`src/Shared/dependencies.php`): every class registered explicitly, e.g. `$container->set(FooService::class, fn($c) => new FooService($c->get(FooRepository::class), $c->get(Helper::class)))`. No autowiring magic.

**Routes.php pattern**:
```php
$group->group('/foo', function (RouteCollectorProxyInterface $group) {
    $group->post('/create/', [FooController::class, 'create'])->setName('foo.create');
    $group->get('/{uuid}/', [FooController::class, 'get'])->setName('foo.view')->add(UuidMiddleware::class);
})
    ->add(AuthorizationMiddleware::class)
    ->add(AuthenticationMiddleware::class)
    ->add(CsrfMiddleware::class);
```
- `setName('module.action')` = permission key checked by `AuthorizationMiddleware`. Without that middleware in the chain, the name is decorative and protects nothing.
- Slim runs `.add()` middleware **LIFO** — last added runs first. The order above executes **Csrf → Authentication → Authorization → handler**. Keep this exact order on new protected groups.
- `UuidMiddleware` on every route with `{uuid}`.
- Public endpoints (catalog listing, register) go directly on the outer `$group`, not the protected sub-group — `getArgument('public')` in `AuthorizationMiddleware` is dead, don't rely on it.
- New module/route checklist: all 3 middleware unless deliberately public (document why); `UuidMiddleware` on `{uuid}` routes; explicit **ownership check** in Service for user-owned resources (cart/review/order) — never rely on "route is protected" alone, never leave ownership checks commented out "for later"; moderation/admin-only fields (`is_approved`, `is_superuser`, `stock_quantity`) never taken directly from request `$data`; route name must match an actually-enforced permission; don't trust `X-Forwarded-For` unless behind a known trusted proxy.

**Database** (`Shared/Database/Database.php`): query builder, not ORM, parameterized only (`$db->select('orders', ['AND'=>[['status_id','=',$id],['id','IN',$ids]]], '*', 'ORDER BY created_at DESC', 20)`). Columns/tables/`ORDER BY` are never parameterized by PDO — only pass hardcoded/whitelisted values, never raw query-string/body input.

**Domain classes**: built from an assoc array (usually a DB row), private props + getters, and context-specific serializers: `toArray()` (internal/full), `toPublicArray()` (safe API response), `apiArray()` (minimal nested). Keep sensitive fields (password hash etc.) out of the public serializers.

**Exceptions**: throw `ValidationException`/`NotFoundException`/`ConflictException`/`UnauthorizedException`/`InformationException` from `Shared/Exception/`. Codes in `ErrorCodes.php`, localized messages in `Shared/Exception/messages/{bg,en}.json` resolved by `ExceptionMessageResolver` per `X-Locale`. Only `ErrorMiddleware` maps exception → HTTP response — don't catch `\Throwable` in Controller/Service to "format" errors unless genuinely recoverable there.

**Response format**: Controllers return via `Helper::json($response, $data, $status)`; `JsonMiddleware` auto-wraps into `{status, date, data}` — never wrap manually.

**Auth/CSRF**: JWT access token in `HttpOnly` cookie (`access_token`); `AuthenticationMiddleware` reads it and sets `current_user` (`id, uuid, role, is_superuser`) request attribute, doesn't throw if missing (that's `AuthorizationMiddleware`'s job). Refresh token stored **hashed** (SHA-256), rotated on `/refresh/`. CSRF is double-submit (`csrf_token` cookie + `X-CSRF-Token` header, `hash_equals`) on every `POST/PUT/PATCH/DELETE`, including "minor" ones like create-review — add `CsrfMiddleware` to every new state-changing route. `Helper::getCurrentUserID($request)` for quick access.

**Logger**: `Logger::log()` only writes when `APP_DEBUG=true`; never log raw refresh tokens/passwords even in debug — hash/UUID/ID only.

---

## Frontend architecture (this repo)

- Next.js 16 App Router, React 19, JSX (not TSX) for app code — TS only for config (`allowJs: true`). Tailwind v4 + `@headlessui/react` + `@heroicons/react`, no component library. No Redux/Zustand (plain Context + hooks), no form library (manual `useState` + hand-rolled validators), no i18n library (custom dictionaries), no axios (`fetch` wrapped in custom client modules). `next.config.ts`: `output:"export"`, `distDir:'build'`, `trailingSlash:true`, images unoptimized.

**Routing** (`app/[locale]/...`, no `middleware.ts` — locale is purely static params + always-prefixed links):
```
app/page.jsx                             root (non-locale, minimal)
app/[locale]/layout.jsx                  metadata, providers, generateStaticParams -> bg/en
app/[locale]/page.jsx                    home
app/[locale]/{about,login,register,profile,checkout}
app/[locale]/store/page.jsx
app/[locale]/store/[category]/page.jsx   only dynamic segment
app/[locale]/{cookies-policy,privacy-policy,terms-and-conditions}
app/robots.ts, app/sitemap.ts            outside [locale]
```
`app/api/*` looks like Route Handlers but isn't — no exported `GET/POST`, just named client-fn modules (see API section below). Harmless under static export.

**i18n**: `locales/{bg,en}.json` flat dicts, dynamic-imported per locale via `app/lib/translations.js`. `[locale]/layout.jsx` resolves messages server-side, passes to `I18nProvider`. `useT()` returns the whole messages object — usage is `t.some_key`, not `t('some_key')`. Server components use `lib/utils.js` → `getT(locale)`. Locale switch: `switchLang(pathname, router, setOpen)`.

**State/providers** (`components/Providers/Providers.jsx`, one `UIContext` via `useUI()`):
- UI: `openCart`, `openModal`+`contentModal` (generic modal), `openProfile`, `selectedCategory`.
- Cart: from `hooks/useCart.js` (`cart, addToCart, removeFromCart, updateQuantity, clearCart, checkOut, submitOrder`) — localStorage-first (`cart`, `cart_uuid`), synced server-side only at `checkOut()` time.
- User: from `hooks/useUser.js` (`user, login, logout, isLoaded, getProfileData`) — denormalized profile in `localStorage('user')`. `authLogic = true` is a dead/placeholder flag.
- Renders global overlays `<Cart>`, `<Modal>`, `<ProfileDrawer>`.
- Wired around it in `[locale]/layout.jsx`: `I18nProvider`, `NotificationProvider`, `ThemeProvider`, `ClientLayout` (cookie banner + GA, gated by `hooks/cookies.js` consent).

**API client** (`app/lib/fetcher.js`, client-side): `credentials:'include'`, `X-Locale` header, `X-CSRF-Token` read from `csrf_token` cookie. On 401 (unless URL contains `/login`, `/register`, or `/refresh`) → calls `/api/v1/auth/refresh/` (deduped via module-level `refreshPromise`), retries once; on refresh failure clears `localStorage.user` and fires a global `auth-expired` event. Exports `get/post/put/patch/del`. `app/lib/serverFetcher.js` is the server-side counterpart (`cache:"force-cache"`, for RSC). `app/lib/backup_fetcher.js` and `components/features/Cart/api.js` are dead/stray code — don't extend them.

**API modules** (`app/api/{auth,cart,customers,store}/route.js`, plain client-fn wrappers, not real handlers):
- `auth`: `login`, `register`, `logout` → `/api/v1/auth/...`
- `customers`: `me`, `updateProfile` → `/api/v1/customers/...`
- `cart`: `getCart`, `createCart`, `updateCart`, `removeItem`, `removeCart`, `checkoutOrder` → `/api/v1/cart/...`
- `store`: client `listProducts`, `listProduct`, `listProductReview`, `addProductReview`, `listCategories`, `speedyOffices`; server-only `getAllProducts`, `getProductsByCategory`, `getCategories` (via `serverFetch`, wrapped again in `app/lib/store/products.js` with fallback to `[]`)

**Checkout** (`app/[locale]/checkout/page.jsx`): client, 3-step wizard, `step` persisted to `localStorage` (`checkout_step`, `checkout_form`), pre-fills from `user.customer` when logged in, redirects to `/${locale}/store` if cart empty.
1. `Step1Contacts.jsx` — firstName/lastName/email/phone via `CheckoutInput`.
2. `Step2Shipping.jsx` — delivery method (`office`/`apt`/`address`, Speedy courier), fetches `storeApi.speedyOffices()`, city/office autocomplete (`AutoComplete.jsx`), always `postalCode` + free-text `notes`.
3. `Step3Review.jsx` — review cart + formData before submit.

Validation: `hooks/useCheckoutValidation.js`, manual regex, no Zod/Yup; `validateStep2` cross-checks office/city against the Speedy list. Submit: `handleCompleteOrder` → `submitOrder` (`useCart.js`) → `cartApi.checkoutOrder(cartUuid, data)`; 201 clears cart + success screen, else `status='error'` with retry. States: `idle|loading|success|error`.

**Product & cart** (`components/features/Product/ProductDetails.jsx`): Headless UI `Dialog`. Fetches approved-only reviews via `reviewsApi.listProductReview(product.uuid)` (`.filter(review => review.approved)`); submits new ones via `addProductReview(selectedVariant.uuid, {rating, comment})` — **note: no guest info fields sent**, see integration gaps below. Manages `selectedVariant` (size), auto-picks first in-stock size, `availableStock = selectedVariant.stock_quantity - cartQuantity`. Helpers in `lib/utils.js`: `getLocalizedValue(field, locale)`, `formatEuroToBgn(price)` (fixed rate 1.95583). Add-to-cart opens `AddToCartModal.jsx` via `contentModal`/`openModal`.

**Profile/Settings** (`components/profile/SettingsTab.jsx`): 3 independent forms sharing one state object — (1) personal info → `updateProfile(user.uuid, form)` then `login({...user, ...form})` (note: `login()` in `useUser.js` ignores its args and just re-calls `getProfileData()`, so the merge is a no-op — latent bug); (2) shipping address, same `handleSaveProfile` call; (3) change password — **not wired to backend**, only a client-side success toast (stub, see integration gaps); (4) delete-account "danger zone" — no handler wired (UI only).

**Conventions**: `components/<Domain>/<Component>.jsx`, feature code under `components/features/{Cart,Cookies,Product,Users}/`, shared UI under `components/UI/`. `"use client"` on every interactive component; pages/layout are server components fetching directly. Hooks in `app/hooks/`: `useCart`, `useUser`, `useCheckoutValidation`, `useModal` (`cookies.js` is plain helpers, not a hook). Styling is mostly Tailwind, but `SettingsTab.jsx` uses inline `style={}` — inconsistent, don't propagate to new code.

---

## ⚠️ Known FE↔BE integration gaps (BE security-fix round, 2026-07)

The BE went through a security-fix pass that changed the API contract. Verified against the current FE code (grep + read, 2026-07) — **none of the following are implemented on the FE yet**:

1. **Cart bootstrap missing.** BE added `GET /api/v1/cart/init/`, meant to be called once on site load (or before first cart/review mutation) for guests — it sets `cart_token` (HttpOnly, proves cart ownership) and `csrf_token` cookies. FE never calls this endpoint anywhere (grep-verified across `app/`). Once BE starts requiring `cart_token` on cart reads/writes, guest add-to-cart/checkout flows may start failing with `401 CART_UNAUTHORIZED` unless `createCart` itself also sets the cookie — confirm with BE, then wire `/cart/init/` into FE bootstrap (e.g. `Providers` mount or first cart interaction).
2. **Generic 401 handler will misfire on cart errors.** `app/lib/fetcher.js`'s `request()` treats *any* 401 (except URLs containing `/login`, `/register`, `/refresh`) as an expired user session: calls `/auth/refresh/`, and on failure clears `localStorage.user` + fires `auth-expired`. A `401 CART_UNAUTHORIZED` from a cart/review endpoint will hit this exact path and incorrectly "log out"/expire a guest who never had a session. Needs a distinct check (`error.code === 'CART_UNAUTHORIZED'` → re-call `/cart/init/` and retry, not the auth-refresh flow) before the new cart contract is safe to rely on.
3. **Guest reviews will fail.** `ProductDetails.jsx` `handleAddReview` (line ~77-82) only sends `{rating, comment}` to `addProductReview`. BE now requires `email`+`firstName`+`lastName` for non-logged-in review creation, else `400 REVIEW_GUEST_INFO_REQUIRED`. Not wired on FE — either add those fields to the review form for guests, or restrict "add review" to logged-in users if that's the intended UX.
4. **Change-password stub needs wiring.** `SettingsTab.jsx`'s password form is UI-only (toast, no request). BE now exposes `PUT /api/v1/users/change-password/` (`{current_password, new_password}`, requires `X-CSRF-Token`; errors: `401` not logged in, `400 PASSWORD_CURRENT_INCORRECT`, `400 PASSWORD_TOO_SHORT` for <6 chars) — connect it.
5. **`GET /api/v1/cart/` (list-all) is now admin-only** — not used anywhere in this shop's FE (verified: only per-uuid cart calls), so no action needed here, but don't add a "browse all carts" admin feature to this repo without checking permissions.
6. **Register error handling already fine.** `RegisterForm.jsx` just surfaces `response.data.error.message` on non-201 — no special-case retry/workaround for the old `USER_ALREADY_EXISTS` bug existed (verified), nothing to clean up.
7. **Error-code handling generally.** BE used to return a generic `401 {"error":"Authentication error"}` for any business error (validation/not-found/conflict) on authenticated requests; now returns the real code (`PRODUCT_NOT_FOUND`, `CART_INSUFFICIENT_STOCK`, etc.) with proper 400/404/409 status. Any FE error-handling that special-cased 401 as "always means re-login" (see gap 2) should be revisited — it's broader than just cart endpoints.

**Bug found + fixed (2026-07): `/cart/init/` was not idempotent, causing live `CART_UNAUTHORIZED` errors for real users.** Reproduced directly against the dev API (register+login a test user, call `/cart/init/` twice in the same session): each call created a **brand-new empty cart and rotated `cart_token`**, orphaning the previous cart. A logged-in user who added an item, then had the page/`Providers` remount (reload, hot-reload, new tab) before checkout, would hit exactly `{"error":{"code":"CART_UNAUTHORIZED","message":"Нямате достъп до тази количка."}}` on checkout — because the stale `cart_uuid` in `localStorage` no longer matched the just-rotated `cart_token`. Root cause was BE-side non-idempotency (user is fixing BE separately). FE mitigation applied: `useCart.js` no longer calls `cartApi.initCart()` unconditionally on every mount. Instead, `ensureCartInit()` (guarded by a plain, non-HttpOnly `localStorage` flag `cart_initialized` — `cart_token` itself is HttpOnly and unreadable from JS) is called lazily from `addToCart()` and `checkOut()`, so it only actually hits the API once per browser session instead of on every reload. `clearCart()` and `useUser.js`'s `logout()` both clear the `cart_initialized` flag too, so a fresh cart cycle re-inits cleanly next time. This reduces (but given BE was non-idempotent, doesn't perfectly eliminate on its own) how often the orphaning can happen — the real fix is BE-side idempotency on `/cart/init/` (return the existing cart_token/cart if one is already valid, don't always create new).

**Status (2026-07): gaps 1-4 fixed.** `cartApi.initCart()` added (`app/api/cart/route.js`) and called on `useCart` mount; `fetcher.js` now checks `error.code === 'CART_UNAUTHORIZED'` before deciding between cart-reinit vs auth-refresh-then-logout; `AddReview.jsx` collects `firstName`/`lastName`/`email` for guests (gated on `useUI().user`) and `ProductDetails.jsx` forwards them; `SettingsTab.jsx` password form now calls `customerApi.changePassword` against `PUT /api/v1/users/change-password/`. Gaps 5-7 (admin-only cart list, register error handling, generic error-code handling) needed no FE change.

---

## ⚠️ Known SEO gaps (audited 2026-07)

**Critical** — no per-product URL at all (`ProductDetails.jsx` is a state-triggered modal, `ShopClient.jsx:81-84`, never in the URL, not indexable/shareable); `ShopClient.jsx` fetches the entire catalog client-side so `/store` and `/store/[category]` ship an empty grid in the initial static HTML; `alternates.canonical` hardcoded to `/bg` in `[locale]/layout.jsx:32` regardless of actual locale (tells Google to drop `/en`); `.env.local` currently has `NEXT_PUBLIC_API_URL=http://localhost:8881` active (real URL commented out) — verify prod deploy overrides this.

**High** — JSON-LD `Organization`/`WebSite` (`[locale]/layout.jsx:89,101`) hardcode domain `sentinell.com`, mismatched vs. the real `sentinelltactical.com` used elsewhere; every route except home shares one generic title/description (no per-route `metadata`/`generateMetadata`); `robots.ts` disallows non-existent `/admin`,`/account` instead of the real `/profile`; `sitemap.ts` is a hardcoded static array, no categories/products pulled from the API; `/` → `/{locale}` redirect is a client-side `<script>` in `app/layout.jsx`, not a real redirect.

**Medium** — `ProductCard.jsx:72` `alt={product.name}` (object, not localized string — should be `getLocalizedValue(product.name, locale)`); homepage has no `<h1>`; `<html lang="bg">` hardcoded in `app/layout.jsx:3` for all locales; no custom `not-found.jsx`; no Product/Offer/AggregateRating/Review/FAQPage JSON-LD anywhere despite real review + FAQ content.

**Low** — `Josefin Sans` declared in `globals.css` but never actually loaded (no `next/font`/link/`@import`); no `manifest.json`/apple-touch-icon/theme-color; minor alt/dimension gaps in `Search.jsx`, `CartItem.jsx`.

Full phased remediation plan (0: quick fixes, 1: per-route metadata + structured data, 2: real product detail routes — needs a BE single-product endpoint, `listProduct(slug)` currently filters by *category* slug not product, 3: polish) was given to the user 2026-07; ask them if it's still current before re-deriving from scratch.

**Phase 0 status: done (2026-07), build-verified.**
- `app/[locale]/layout.jsx`: `metadata` → `generateMetadata({params})`, locale-aware `canonical`/`alternates.languages`/OG `url`/`locale`; JSON-LD `Organization`/`WebSite` now use `sentinelltactical.com` (was wrongly `sentinell.com`); the file now also owns `<html lang={locale}><body>` (moved down from the root layout, see below).
- `app/layout.jsx` simplified to `export default function RootLayout({children}) { return children; }` — no longer renders `<html>`/`<body>` itself, and the old catch-all client-side redirect script (any unmatched path → `/bg`) is gone; unmatched paths now correctly fall through to `/_not-found` instead of silently bouncing to `/bg`.
- `app/page.jsx` (the non-locale `/` bounce route) now supplies its own `<html lang="bg"><body>` plus `<meta http-equiv="refresh" content="0; url=/bg">`, `<link rel="canonical" href=".../bg">`, a `<noscript>` fallback link, and the JS `redirect` as a fast-path fallback — real static-export can't do a server 301 (`next.config` `redirects()` needs a Node server), this is the closest equivalent. Verified via `next build` + reading the generated `build/{index,bg/index,en/index}.html`: exactly one `<html>`/`<body>` per page, correct `lang` per locale, correct canonical per locale.
- `app/robots.ts`: `disallow` now lists the real `/api`, `/checkout`, `/profile` (was wrongly `/admin`, `/account`, which don't exist as routes; `/profile` was previously uncovered).
- `components/features/Product/ProductCard.jsx`: `alt={product.name}` → `alt={getLocalizedValue(product.name, locale)}`.
- Skipped by user choice: homepage `<h1>` (Hero has none) — not done, revisit if asked.
- Still open from the full audit: per-route `metadata`/`generateMetadata` for `/store`, `/store/[category]`, `/about`, policy pages (all still share the root's generic title/description); dynamic `sitemap.ts` from the API; the whole Phase 2 (real indexable product pages, `ShopClient.jsx` client-side-only catalog fetch) is unstarted and is the single biggest remaining SEO gap.

**Workflow note**: this user wants every code change proposed with an exact before/after diff and explicit confirmation *before* it's applied — one change per `Edit` call, not bundled. Don't batch multiple unrelated fixes into a single edit even in the same file. All user-facing copy must go through `locales/{bg,en}.json` (`t.key`) — never hardcode strings directly in components/pages, including meta descriptions.

**Phase 1 status: done (2026-07), build-verified.** Added `generateMetadata` (unique per-locale title/description, all copy via new locale keys `store_meta_description`, `category_meta_description` (has a `{category}` placeholder replaced at runtime with `t[category]`), `privacy_policy_meta_description`, `terms_meta_description`, reusing existing `store_title`, `t[category]`, `about_menu_label`, `about_us_title_banner_desc`, `footer_cookie_label`, `cookies_description`, `footer_privacy_policy_label`, `footer_terms_and_conditions_label`) to: `store/page.jsx`, `store/[category]/page.jsx`, `about/page.jsx`, `cookies-policy/page.jsx`, `privacy-policy/page.jsx`, `terms-and-conditions/page.jsx`. `about/page.jsx` was `'use client'` (blocks `metadata` export) — split into a new `components/UI/AboutContent.jsx` (client, unchanged UI) + `about/page.jsx` now a server component with `generateMetadata`. Added `FAQPage` JSON-LD to `FAQ.jsx` built from the existing `faqs` array (works fine despite being a client component — static export still pre-renders the initial HTML). Verified via `next build` + reading generated HTML: unique `<title>` per route/locale, correct meta description, no literal `{category}` left unreplaced, `FAQPage` schema present.

Still open from the audit: Phase 2 (real indexable product pages — biggest remaining gap) and Phase 3 polish (custom 404, `next/font`, minor alt/dimension gaps) are unstarted.

**Phase 2: BLOCKED on a BE change (as of 2026-07), design decided, do not start the route yet.**
Correction to the earlier audit: no new BE *endpoint* is actually needed — `getProductsByCategory(slug)`/`listProduct(slug)` (category-scoped product list) already returns full product detail fields (description, price, sizes, stock, images), the same object already rendered in the `ProductDetails` modal. So build-time SSG can source product pages from the existing category-list call; no separate single-product fetch required.

The one real blocker: products have no `slug` field today (only categories do — `product.uuid` is the only identifier). User decided (2026-07) to **wait for BE to add a unique `slug` field to products** (returned in `products-list`/`products-list/{category}` responses) rather than ship ugly uuid URLs now. **Do not start building the `[product]` route until that field exists on the API response — check for it before resuming this work.**

**Phase 2 status: DONE (2026-07) except intercepting-route modal-sync, which is a confirmed Next.js hard limitation. Build-verified.**

The BE started returning a `slug` field per product (confirmed live via `curl localhost:8881/api/v1/products-list/`) — unblocked the same day. `getProductsByCategory(slug)`/`listProduct(slug)` already return full product detail fields (description, price, sizes, stock, images), so no new BE endpoint was needed, only the slug field.

What shipped:
1. **`components/features/Product/ProductDetailContent.jsx`** (new) — the actual product-detail markup/logic extracted from `ProductDetails.jsx` (image, price, size selector, description, add-to-cart, reviews), minus the `Dialog`/close-button chrome. Accepts `product` + optional `initialReviews` (uses it as initial state if provided, otherwise falls back to the original client-side `listProductReview` fetch).
2. **`app/lib/store/reviews.js`** (new) + `getProductReviews` added to `app/api/store/route.js` — server-side (`serverFetch`) review fetch, filtered to `approved`, for use at build time.
3. **`app/lib/store/products.js`**: added `findProduct(categorySlug, productSlug)` and `getAllProductParams()` (full category×product enumeration) shared helpers.
4. **`app/[locale]/store/[category]/[product]/page.jsx`** (new) — real, statically-generated, indexable product page: `generateStaticParams` (via `getAllProductParams`), `generateMetadata` (localized title/description/OG image), renders `ProductDetailContent` + `Product`/`Offer`/`AggregateRating` JSON-LD (rating omitted when there are zero reviews). Verified server-rendered (name/description/price present in raw static HTML, not just client-hydrated).
5. **`sitemap.ts`**: converted to an async function pulling `getCategories()`/`getProductsByCategory()` at build time — now includes all categories and all products dynamically (26 URLs incl. bg/en, up from 4 hardcoded paths), plus the previously-missing `/cookies-policy`, `/privacy-policy`, `/terms-and-conditions` static pages. Needed an explicit `(category: any)` type annotation (mixed JS/TS + `strict: true` otherwise fails with implicit-any).

**Reverted / dead end — do not retry without a real reason to believe it changed:** attempted to keep the existing grid quick-view modal wired to the new real URL via Next.js **intercepting routes** (`@modal` parallel slot + `(.)[category]/[product]`). Confirmed via actual `next build`: **"Intercepting routes are not supported with static export"** — a hard, documented Next.js limitation (`output: 'export'`), not a bug in this code. All of that scaffolding (`store/layout.jsx`, `store/@modal/*`, `components/features/Product/ProductModal.jsx`) was created, proven broken, and deleted.

**User's decision on grid UX (2026-07): leave the existing modal completely untouched.** `ProductCard.jsx`, `ShopClient.jsx`, and `ProductDetails.jsx` were **not modified** — clicking a product in the grid still opens the original state-driven modal exactly as before. The new `[product]` page exists as a parallel, independent entry point (Google/shared links/sitemap), not linked from the grid's click UX. This means `ProductDetailContent.jsx` and `ProductDetails.jsx` now have near-duplicate logic (acceptable tradeoff, explicitly chosen over refactor risk) — if asked to reduce duplication later, the natural move is making `ProductDetails.jsx` a thin `Dialog` wrapper around `ProductDetailContent`, same as the abandoned `ProductModal.jsx` was, minus the `router.back()` bit (revert to its original `closeDetail` prop).

If a URL-synced modal UX is wanted later without intercepting routes, the real option is a DIY approach: `ProductCard` becomes a real `<Link>`, `onClick` does `preventDefault()` + `router.push(url, {scroll:false})`, and the grid page watches the pathname to conditionally render an overlay client-side — more custom code, not attempted.

**Phase 3 status: done (2026-07), build-verified.**
- `next/font/google` `Josefin_Sans` loaded in `[locale]/layout.jsx` as CSS var `--font-josefin`, applied via `className` on `<body>`; `globals.css`'s `font-family` now references `var(--font-josefin)` instead of the never-loaded literal name. Caveat: Josefin Sans has no Cyrillic glyphs on Google Fonts — Latin/English text now renders in the real font, Bulgarian text still falls through to the Helvetica fallback (unchanged from before, just not newly broken).
- Custom 404: `app/[locale]/not-found.jsx` (client component, `useT()`/`useParams()`, branded + locale-aware, links to `/{locale}/store`) for not-found boundaries hit during client-side navigation under a locale; `app/not-found.jsx` (own `<html>`/`<body>`, inline styles since it's outside `[locale]/layout.jsx` and doesn't get `globals.css`) as the generic fallback — this is what static hosts actually serve as `404.html`/`_not-found` for hard-loaded broken URLs, since arbitrary unmatched paths under `[locale]` have no pre-generated static file to begin with (only `generateStaticParams`-enumerated paths exist) — the locale-aware one mainly helps for `notFound()`-triggered or client-router-caught cases, not arbitrary typo'd hard loads. Verified both render correctly in the built `404.html`/`_not-found/index.html`.
- Added `not_found_message`/`not_found_cta` locale keys (bg/en).
- `Search.jsx`: raw `<img>` (no `alt` at all) → `next/image` with `alt={getLocalizedValue(p.name, locale)}` and explicit `width={40} height={40}`.
- `CartItem.jsx`: raw `<img>` (alt was already correct) → `next/image` with explicit `width={96} height={96}`.

All three SEO phases (0, 1, 2, 3) from the 2026-07 audit are now complete.
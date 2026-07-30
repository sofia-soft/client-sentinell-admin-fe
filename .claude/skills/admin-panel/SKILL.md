---
name: admin-panel
description: Reference for client-sentinell-admin-fe, the Vite/React/Mantine admin panel that manages the Client-Sentinel shop (users, roles, permissions, products, categories, orders, etc.) against the same client-sentinell-admin-be Slim4 API used by the public shop. Use when working on any page/component/api module in this repo, adding a new CRUD module, or debugging table/form/permission behavior.
---

# Client-Sentinel admin panel — reference

This repo is a Vite + React 19 SPA (NOT Next.js, NOT the shop — that's a sibling repo covered by the `fullstack-shop` skill). It's a classic CRUD admin backing the same BE (`client-sentinell-admin-be`, Slim 4 / PHP-DI, `/api/v1/...`) that the public shop talks to. `dist/` is a local Vite SPA build output, gitignored.

Stack: React 19 + JSX (no TS beyond config), `react-router-dom` v7 (flat routes, no locales/nesting), Mantine v9 (`core`, `form`, `dates`, `dropzone`, `modals`, `notifications`, `nprogress`, `charts`) as the only UI kit, `@tabler/icons-react`, `recharts`, `dayjs`. No Redux/Zustand — one `AuthContext`. No form library — manual `FormData`-based forms. No axios — hand-rolled `fetch` wrapper.

---

## Environment switching (unusual — read this before touching API config)

There's no single API base URL. `layouts/AdminLayout.jsx` renders a PROD/TEST/DEV badge in the header; picking one calls `localStorage.setItem('api-env', env.toUpperCase())` then **hard-reloads the page** (`window.location.reload()`). `api/requester.js`'s `getApiBase()` reads that `api-env` key and resolves `import.meta.env[VITE_API_URL_${env}]` (from `.env`: `VITE_API_URL_PROD/TEST/DEV`). Default env if unset is `"prod"` (lowercase fallback string, but stored values are uppercase — `getApiBase` does `VITE_API_URL_${env}` with whatever case is in storage, so first-run before any switch reads `VITE_API_URL_undefined` unless `localStorage['api-env']` already has an uppercase value — verify this actually resolves correctly before assuming a fresh browser profile hits prod by default).

`vite.config.js` configures a dev-server proxy (`/api` → `https://api.sentinelltactical.com`) that is **dead code** — grep-confirmed nothing in `src/` makes relative `/api/...` calls; `requester.js` always calls the full `API_BASE` URL directly. Don't rely on the proxy; don't assume changing it does anything.

---

## Auth & permissions

`contexts/AuthProvider.jsx` holds a denormalized profile in `localStorage['user']`: `{username, permissions: [{resource, action}], is_superuser, expiresAt}`. `is_superuser` (1/true) short-circuits `hasPermission()` to always `true`. Login/logout go through `api/authApi.js`; `useAuth()` throws if used outside the provider.

`api/requester.js` (`get/post/put/patch/del`) is the single fetch wrapper: `credentials:'include'`, `X-CSRF-Token` from the `csrf_token` cookie, JSON body unless URL contains `upload-image` (then raw `FormData`). On a 401 (not on `/login` or `/refresh` URLs) it calls `/api/v1/auth/refresh/` once (deduped via a module-level `refreshPromise`), retries with the new CSRF token from the refresh response, and on refresh failure clears `localStorage.user` + dispatches a global `auth-expired` event that `AuthProvider` listens for to clear state. Same shape as the shop's `fetcher.js` but simpler — no cart-specific error-code branching here since this app has no guest/cart concept.

Route protection: `App.jsx`'s `<AuthGuard isAllowed={isAuthenticated}>` wraps the entire `<AdminLayout>` subtree (single guard, not per-route). Nav items (`config/appConfig.js` `SYSTEM_MENU_ITEMS`/`SITE_MENU_ITEMS`) are filtered client-side by `hasPermission(item.resource, item.action)` — this hides menu entries but the routes themselves aren't individually permission-gated beyond the one `isAuthenticated` check, so a permission check inside the page/BE is still what actually protects the resource.

---

## The CRUD module pattern (every page follows this — copy it exactly for new modules)

Each resource (Users, Roles, Permissions, Products, ProductsAttributes, Categories, Customers, Reviews, Cart, Orders) has four files:

1. **`api/<module>Api.js`** — thin `requester` wrappers: `list*`, `create*`, `update*(uuid, data)`, `delete*(uuid)`, sometimes `get*(uuid)`. Paths follow `/api/v1/<resource>/`, `/create/`, `/update/{uuid}/`, `/delete/{uuid}/` (trailing slashes matter, mirrors BE routing).
2. **`config/<module>Config.js`** — exports `<MODULE>_HEADER` (table columns as `{key, value}`) and `BUTTON_VISIBILITY` (`search`, `first_filter`, `second_filter`, `export`, `import`, `create`, each `{visible, permission?: {resource, action}}`).
3. **`pages/<Module>.jsx`** — owns all state: fetch-on-mount into a list, `useDisclosure` for a `CustomDrawer`, `handleCreate`/`handleEdit` (set drawer type + open), `handleDelete` (via `CustomConfirmModal` → `modals.openConfirmModal`), and one generic `handleSubmitForm` that calls `utils/handlerSubmitForms.js` with either the create or update api fn depending on `form.target`.
4. **`components/<Module>/<Module>CreateForm.jsx` + `<Module>UpdateForm.jsx`** — plain uncontrolled `<form onSubmit=... target="create"|"update" name={uuid on update}>`. Fields are read via `FormData`, not controlled inputs. The `target`/`name` attributes on the `<form>` element itself are how the generic submit handler knows whether to call `create*(data)` or `update*(uuid, data)` — this is the load-bearing trick, don't refactor to controlled inputs without preserving that dispatch.

**`utils/handlerSubmitForms.js`** is the one place that turns `FormData` into an API call: coerces `is_active`/`is_system`/`approved` checkboxes to `1`/`0`, strips `€` and parses `price`, `parseInt`s `stock_quantity`, collects repeated `permissions` checkboxes via `formData.getAll`, renames `role_name`→`name`. Its success/failure branch is `response.status === 200|201 && !('success' in dataResponse)` — this is checking the BE payload does **not** contain a `success` key as its definition of success, which is fragile/inverted-looking; if a new endpoint's response shape includes a top-level `success` field, this will misclassify it as a failure. Verify actual response shape before wiring a new module's forms through this helper.

**`utils/getErrorMessage.js`** + `i18n/{bg,en}.js` is an **error-code-to-string dictionary**, not app-wide i18n (no locale switcher exists in this admin UI at all — unlike the shop repo). Bilingual content fields coming back from the BE (`name`, `description` as JSON `{bg,en}`) are always rendered hardcoded to `'en'` (`getLocalizedValue(x, 'en')` in pages, `parseJson(...)?.en` in `TableTemplate.jsx`) regardless of what's actually in the record.

---

## Table & pagination (`PageContentTemplate.jsx` + `TableTemplate.jsx`)

`PageContentTemplate` has two mutually exclusive modes selected by whether a `meta` prop is passed:
- **FE-mode** (no `meta`, e.g. current Products/Roles/ProductsAttributes pages): filters the full in-memory `rows` array client-side (`filterBySearch`/`filterBySelect` in `utils/search.js`) and paginates locally (`DEFAULT_LIMIT = 10`).
- **BE-mode** (`meta = {total, limit, page, last_page}` passed): pagination defers to the server via `onPageChange`, no client-side slicing.

`first_filter`/`second_filter` in a module's `BUTTON_VISIBILITY` only work in FE-mode (`filterBySelect` needs the full row set). Check which mode a page is actually in before wiring a new filter.

`TableTemplate.jsx`'s `renderCell` is a big if-chain keyed by column name, not a generic renderer registry — it special-cases `items`, `shipping_address`/`speedy_office`, `customer`, `role`, `comment`, `rating`, `dates`, `description`, `status`/`is_active`/`approved`, `is_system`. Adding a new "special" column type means extending this if-chain here; there's no per-column render-prop mechanism.

---

## Fixed 2026-07-13 (was "known dead code / rough edges" — resolved this session)

- **`components/Roles/RoleUpdateForm.jsx`** — `Tabs.List` was missing `Tabs.Tab` triggers for the `permissions`/`system` panels it rendered (unreachable in the UI). Added `Tabs.Tab value="permissions" onClick={loadPermissions}` (mirrors `RoleCreateForm.jsx`) and `Tabs.Tab value="system"`. Also deleted a leftover block of Bulgarian AI-chat-style commentary that was sitting in a comment at the bottom of the file.
- **`api/rolesApi.js`** — `` `${BaseUrl}/assign/}` `` had a stray `}` baked into the template literal; fixed to `` `${BaseUrl}/assign/` ``.
- **`api/permissionsApi.js`**'s `getResources` called `requester.get()` with no URL. Checked the BE (`client-sentinel-be/src/Modules/Permissions/Routes.php`) and confirmed the real route is `GET /permissions/resources/` → wired `getResources` to `` `${BaseUrl}/resources/` ``.
- **`api/productsAttributesApi.js`** — `createProduct`/`updateProduct`/`deleteProduct` (copy-pasted names from `productsApi.js`, but actually hit `/api/v1/product-attributes/...`) renamed to `createProductAttribute`/`updateProductAttribute`/`deleteProductAttribute`; call sites in `pages/ProductsAttributes.jsx` updated to match. `pages/Products.jsx` still imports the unrelated `listProductsAttributes` from this same module (that one was already correctly named) — no longer any naming collision risk with the real `productsApi.js` exports.
- **`components/CustomModal.jsx`** and **`layouts/Header.jsx`** — both confirmed unused anywhere (grep) and deleted. Confirm-dialogs go through `CustomConfirmModal.jsx`; the real header lives inline in `AdminLayout.jsx`.
- **`pages/ProductsAttributes.jsx`** lint cleanup — removed unused `getErrorMessage`/`getLocalizedValue` imports (leftover from copy-pasting `Products.jsx`), added the `// eslint-disable-next-line react-hooks/set-state-in-effect` comment above the mount-effect's `setLoader(true)` to match the convention already used in `pages/Roles.jsx` for the same pattern.

The **Products Attributes** module itself (`api/productsAttributesApi.js`, `config/productsAttributesConfig.js`, `pages/ProductsAttributes.jsx`, `components/ProductsAttributes/{ProductsAttributesCreateForm,ProductsAttributesUpdateForm}.jsx`) is otherwise a normal instance of the standard CRUD module pattern above, wired into `App.jsx`'s router and `config/appConfig.js`'s `SITE_MENU_ITEMS`.

---

## Working agreement

Follow whatever workflow/diff-confirmation conventions the user states in a given session; nothing project-wide has been established yet for this repo specifically (unlike `fullstack-shop`, which has a standing "confirm every edit individually" agreement — that agreement was made in the context of the shop repo's SEO work, not this one, so don't assume it carries over without the user saying so here too).
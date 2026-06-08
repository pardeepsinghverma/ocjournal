# Backend API Integration Guide

> **Goal:** Wire this React Native app (`ocjournal`) to the live **brandwik OpenCart 4** backend, replacing the static JSON fixtures (`src/data/*.json`, hardcoded arrays) with real API calls.
>
> **Audience:** A mid/senior RN developer who knows this app but not the backend.
>
> **Backend location (dev):** WSL Ubuntu → `/home/verma/code/brandwik`, served at `http://localhost:8080` (Docker). Branch `phase-2`.

---

## 1. TL;DR / Architecture

The backend exposes **two completely separate API systems**. The mobile app uses parts of **both**, and must **avoid a third**.

| System | What it is | Used by RN app? | Auth |
|---|---|---|---|
| **A. Storefront JSON API** | Header-based content negotiation layered on the normal catalog URLs. Hit the *same* storefront URLs a browser uses, add one header, and you get JSON back instead of HTML. | **YES — all browsing** (home, product, category, search, special, info pages) | `X-OC-Storefront-App: <key>` header. Dev key gate is **open** (any non-empty value passes). |
| **B. Classic `catalog/api/*`** | OpenCart 4's traditional stateful API (`route=api/cart`, `api/order`, `api/customer`, …). | **YES — cart / checkout / account** writes | Session token (`api_token`) for most calls; HMAC-SHA1 signature for the `api/order` / `api/subscription` entry points. |
| **C. Admin React API** (`/alpha/*` with `X-OC-React-Admin`) | The OpenCart admin-panel SPA backend. | **NO — OFF-LIMITS.** Do not call any `/alpha/*` route or send `X-OC-React-Admin` from the mobile app. It is the admin control plane, not a customer surface. | Admin auth. |

> **Off-limits, explicitly:** The mobile app must **never** touch the Admin React API (`/alpha/*`, header `X-OC-React-Admin`). It manages catalog/admin operations and has no business in a customer-facing app. If you see those routes referenced anywhere, they are not for us.

**Server facts (dev):**

- OpenCart **4.1.0.3**, running in Docker (`web:8080`, `db:3306`, `redis:6379`).
- Dev base URL: **`http://localhost:8080`**.
- Storefront dev API-key gate is **OPEN** — any non-empty `X-OC-Storefront-App` value works.
- **Prices, specials and tax come back as PRE-FORMATTED currency strings** (e.g. `"$969.80"`), not numbers. Plan for string display + `parsePrice()` for math.

```
RN App
 ├─ Browsing (read)  ──► [A] Storefront JSON API   (X-OC-Storefront-App header on catalog URLs)
 ├─ Cart/Checkout/Account (write) ──► [B] catalog/api/* (api_token / signature)
 └─ Admin React API [C]  ✗  NEVER
```

---

## 2. Connecting the RN client

### 2.1 The single change in `src/api/apiclient.ts`

The client already exists with the right signature but points at the wrong host and never injects the storefront header. Two edits fix it.

**Current (`src/api/apiclient.ts`, line 36):**

```js
const axiosInstance = axios.create({
  baseURL: 'https://dev301.fathershops-test.xyz/?mp=1', // WRONG
  timeout: 10000,
});
```

**Updated** — point at the storefront origin (NOT `?mp=1`) and **always** send `X-OC-Storefront-App`:

```js
import { API_DOMAIN, STOREFRONT_APP_KEY } from './const';

const apiRequest = async ({ url, method = 'GET', data = null, params = null, headers = {} }) => {
  try {
    const axiosInstance = axios.create({
      baseURL: API_DOMAIN,           // 'http://localhost:8080'  (no '?mp=1')
      timeout: 10000,
    });

    const config = {
      url,
      method,
      data,
      params,
      headers: {
        // Storefront content-negotiation header. Dev gate is open: any non-empty value works.
        'X-OC-Storefront-App': STOREFRONT_APP_KEY,
        ...headers, // allow per-call overrides (e.g. api_token-based calls add their own)
      },
    };

    const response = await axiosInstance(config);
    return { data: response.data };
  } catch (error) {
    // ...unchanged error handling...
  }
};
```

> **Why the header always:** Storefront **Gate 1** rejects (returns HTML / early-exits) any request *without* `X-OC-Storefront-App`. Injecting it centrally means every browsing call gets JSON. The classic `api/*` write calls don't need this header but it's harmless to leave it.

### 2.2 Centralize base URL + key in `src/api/const.ts`

The current `const.ts` has a stale domain and unused endpoints. Replace with:

```ts
// src/api/const.ts

// Dev base. In prod, swap to the real origin (and set a real STOREFRONT_APP_KEY).
export const API_DOMAIN = 'http://localhost:8080';

// Storefront content-negotiation key. Dev gate is OPEN — any non-empty value passes.
// In prod this MUST match the backend's config_storefront_api_key exactly.
export const STOREFRONT_APP_KEY = 'testkey';

// Storefront (browsing) routes — note: NO 'journal3/' prefix (backend strips it).
export const API_ENDPOINTS = {
  COMMON_HOME:    'index.php?route=common/home',
  PRODUCT:        'index.php?route=product/product',
  PRODUCT_SEARCH: 'index.php?route=product/search',
  PRODUCT_SPECIAL:'index.php?route=product/special',
  INFORMATION:    'index.php?route=information/information',
};
```

### 2.3 CORS / origin & price-format notes

- **CORS / origin:** On a physical device or Android emulator, `localhost` is **not** the host machine. Use the Android emulator alias `http://10.0.2.2:8080`, or your LAN IP (`http://192.168.x.x:8080`), or an `adb reverse tcp:8080 tcp:8080` tunnel. iOS simulator can use `localhost` directly. Keep this in `API_DOMAIN`.
- **Prices are strings.** Every `price`/`special`/`tax` you receive is already formatted (`"$969.80"`). Display the string directly; use `parsePrice()` (from `src/utils/formatPrice.js`, also duplicated in `cartSlice.js`) whenever you need a number for arithmetic.

---

## 3. Storefront JSON API reference

### 3.1 The 6 whitelisted routes

These are the **only** routes the storefront handler will serve as JSON (`PAGE_ROUTES` whitelist).

| Route | Params | Purpose |
|---|---|---|
| `common/home` | none | Homepage: Journal3 layout, breadcrumbs, language strings |
| `product/category` | `path` (category id) | Category listing — thumbnails, filters, sorts *(see HTML caveat)* |
| `product/product` | `product_id` | Single product detail (price, images, attributes, reviews, related) |
| `product/search` | `search`, `category_id`, `sort`, `order`, `limit` | Search results + facets |
| `product/special` | none | Special / sale products listing |
| `information/information` | `information_id` | Info pages (About, FAQ, …) |

### 3.2 The 4 gates (request lifecycle)

1. **Gate 1 — header presence.** `HTTP_X_OC_STOREFRONT_APP` must be present. Any non-empty value passes. If missing, the handler returns early with zero overhead (you get the normal HTML page, not JSON).
2. **Gate 2 — `product/thumb` interception.** Internal route used by `product/category` to render each product card. The handler intercepts it, collects raw product data into a static array, and returns a JSON stub. You will not call this directly; it's the mechanism that *should* turn category HTML into structured `collected_products`.
3. **Gate 3 — route whitelist.** The route is normalized by stripping a leading `journal3/` prefix, then checked against `PAGE_ROUTES`. Not whitelisted ⇒ early return.
4. **Gate 4 — API key validation.** If `config_storefront_api_key` is set in OC settings and does **not** match your header ⇒ `401 Unauthorized` JSON. If the config key is **empty (dev)**, any non-empty header passes. **The gate is inverted from intuition: empty config = OPEN, non-empty config = strict match.**

### 3.3 The `_storefront` envelope

Every storefront JSON response is the controller's `$data` with the HTML-rendering keys stripped and a `_storefront` envelope attached:

```json
{
  "_storefront": {
    "route": "journal3/common/home",
    "layout_id": 1,
    "layout": {
      "top":    { "rows": { "1": { "columns": { "1": { "items": { "...": { "item": { "type": "...", "id": 0, "data": {} } } } } } } } },
      "bottom": { "rows": { } }
    }
  }
}
```

- `route` — full route **including** the `journal3/` prefix (the prefix is only stripped internally for the whitelist check; you still see it here).
- `layout_id` — Journal3 layout id (`1`=home, `2`=product, `13`=search, `18`=special, `23`=information).
- `layout` — Journal3 structure with positions: `top`, `bottom`, `column_left`, `column_right`, `content_top`, `content_bottom`, `footer_top`, `footer_bottom`, `global`. Each position → `rows` → `columns` → `items`, where each item carries `item.type` / `item.id` / `item.data`. **May be `null`** if Journal3 is inactive or layout can't resolve — handle that gracefully.

**Keys stripped** from the controller output before sending: `header`, `footer`, `column_left`, `column_right`, `content_top`, `content_bottom`, `pagination`, `journal3_top`, `journal3`, plus `sort_*` and `journal3_*` keys.

**Keys preserved (your business data):** `products`, `categories`, `breadcrumbs`, `heading_title`, `description`, `price`, `images`, `options`, `attribute_groups`, `related`, etc.

> **Route prefix rule for the client:** Call **without** `journal3/`. `index.php?route=common/home` is correct. The backend adds/strips the prefix itself; you'll merely *see* `journal3/...` back in `_storefront.route`.

**`item.data` varies by module type:**

- `master_slider` / `slider` → `items` / `images`
- `products` → a `result` array (the product cards)
- `banners` → `items` array with `href` / `target`

### 3.4 Live response shapes (ground truth)

| Route (dev) | Top-level keys returned | `layout_id` |
|---|---|---|
| `common/home` | language strings + `_storefront` | 1 |
| `product/product&product_id=42` | `breadcrumbs, heading_title, product_id, manufacturer, model, reward, points, description, stock, rating, review, thumb, images, price, special, tax, discounts, options, subscription_plans, minimum, attribute_groups, related, tags, share` | 2 |
| `product/search&search=shirt` | `heading_title, products, categories, sorts, limits, results, search, category_id, sort, order, limit` | 13 |
| `product/special` | `products, sorts, limits, results, breadcrumbs` | 18 |
| `information/information&information_id=4` | `heading_title, description, breadcrumbs` | 23 |

`images[i]` keys (product detail): `{ thumb, thumb2x, popup, popup2x }`. `price`/`special`/`tax` are formatted strings; `special` is `false` when there's no sale.

### 3.5 curl examples

```bash
# Homepage (dev mode, no real key required)
curl -s -H 'X-OC-Storefront-App: testkey' http://localhost:8080/ | jq '._storefront.route'

# Product detail by id  -> note price is a formatted STRING
curl -s -H 'X-OC-Storefront-App: testkey' \
  'http://localhost:8080/?route=product/product&product_id=42' | jq '.price, .images[0].thumb'

# Search by keyword
curl -s -H 'X-OC-Storefront-App: testkey' \
  'http://localhost:8080/?route=product/search&search=shirt' | jq '.products | length'

# Category by path (sometimes returns HTML in .products — see Gotchas)
curl -s -H 'X-OC-Storefront-App: testkey' \
  'http://localhost:8080/?route=product/category&path=20' | jq '.products'

# Special / sale products
curl -s -H 'X-OC-Storefront-App: testkey' \
  'http://localhost:8080/?route=product/special' | jq '.products | length'

# Information page (About Us)
curl -s -H 'X-OC-Storefront-App: testkey' \
  'http://localhost:8080/?route=information/information&information_id=4' | jq '.heading_title'

# Key validation: with a WRONG key in prod this returns a 401 error
curl -s -H 'X-OC-Storefront-App: wrong-key' http://localhost:8080/ | jq '.error'

# Inspect the layout module map (types + data keys)
curl -s -H 'X-OC-Storefront-App: testkey' http://localhost:8080/ \
  | jq -r '._storefront.layout.top.rows[].columns[].items[].item | "\(.type)-\(.id): \(.data | keys | join(","))"'
```

> **Note:** `?route=...` and `index.php?route=...` both work on the storefront; this guide uses `index.php?route=...` in client code for clarity.

---

## 4. Screen-by-screen wiring

| Screen | File | Fixture today | Endpoint to call | Notes |
|---|---|---|---|---|
| Home | `src/Tabs/Home/HomeScreen.js` | `src/data/home.json` | `common/home` | Fixture **is** a saved API response — layout engine already correct |
| Product | `src/screens/ProductView.js` | `src/data/productView.json` | `product/product&product_id={id}` | `productId` param currently **ignored** |
| Catalog (category view) | `src/Tabs/Catalog/CatalogScreen.js` | `FALLBACK_PRODUCTS` | `product/search&search=&category_id={id}` (primary), `product/category&path={id}` (fallback) | Keep `CATALOG_DATA` for the grid picker |
| Search | `src/screens/SearchScreen.js` | `src/data/product.json` | `product/search&search={term}` | No input field exists yet — must add `TextInput` |

### 4.1 HomeScreen — almost no change needed

**Key insight:** `src/data/home.json` is itself a **saved `common/home` storefront response**. It already has the `_storefront.layout.top/bottom.rows` shape. So `componentMap` / `renderSection` need **zero** structural change — you only swap the data source from the fixture to a live fetch and feed `_storefront.layout.top.rows` / `bottom.rows` exactly as the fixture did.

**Before (`HomeScreen.js`, lines 17, 29–30, 48–63, 110):**

```js
import layoutData from './../../data/home.json';
// ...
const [contentTop, setContentTop]   = useState(layoutData._storefront.layout.top.rows);
const [contentBottom, setContentBottom] = useState(layoutData._storefront.layout.bottom.rows);

const fetchLayout = async () => { /* all commented out — dead code */ };

// refreshControl onRefresh={fetchLayout}  // fetchLayout does nothing
```

**After:**

```js
import apiRequest from '../../api/apiclient';
import { API_ENDPOINTS } from '../../api/const';
import { setPage } from '../../store/pageSlice';
// (drop the home.json import entirely)

const [contentTop, setContentTop]       = useState(null);
const [contentBottom, setContentBottom] = useState(null);
const [refreshing, setRefreshing]       = useState(false);

const fetchLayout = async () => {
  setRefreshing(true);
  dispatch(setPage({ name: 'home', loading: true }));
  const { data, error } = await apiRequest({ url: `/${API_ENDPOINTS.COMMON_HOME}` });
  if (data?._storefront?.layout) {
    setContentTop(data._storefront.layout.top?.rows ?? null);
    setContentBottom(data._storefront.layout.bottom?.rows ?? null);
    dispatch(setPage({ name: 'home', data, loading: false, error: null }));
  } else {
    dispatch(setPage({ name: 'home', loading: false, error: error || 'No layout' }));
  }
  setRefreshing(false);
};

useEffect(() => { fetchLayout(); }, []);   // was an empty no-op effect (line 68)
```

`renderSection(contentTop)` / `renderSection(contentBottom)` and the `componentMap` lookup (`item.item.type` / `item.item.data`) stay **exactly as-is**. Guard the renders for `null` while loading (the existing `if (!sectionRows) return null;` already does this).

### 4.2 ProductView — fetch by the param it currently ignores

`ProductView.js` extracts `productId` (line 54) but then throws it away: `const product = productData;` (line 55) hardcodes the fixture. Wire the fetch and thread the id.

**Before (`ProductView.js`, lines 13, 54–55):**

```js
import productData from './../data/productView.json';
// ...
const productId = route.params?.productId;
const product = productData;   // <-- fixture, productId ignored
```

**After:**

```js
import apiRequest from '../api/apiclient';
import { API_ENDPOINTS } from '../api/const';
import { setPage } from '../store/pageSlice';
// (drop the productView.json import)

const productId = route.params?.productId;
const [product, setProduct] = useState(null);

useEffect(() => {
  if (!productId) return;
  let alive = true;
  (async () => {
    dispatch(setPage({ name: 'productView', loading: true }));
    const { data, error } = await apiRequest({
      url: `/${API_ENDPOINTS.PRODUCT}&product_id=${productId}`,
    });
    if (alive && data) {
      setProduct(data);
      dispatch(setPage({ name: 'productView', data, loading: false, error: null }));
    } else if (alive) {
      dispatch(setPage({ name: 'productView', loading: false, error: error || 'Load failed' }));
    }
  })();
  return () => { alive = false; };
}, [productId]);

if (!product) return null; // or a loading skeleton — every render below reads `product`
```

The rest of the component already uses the right field names (`product.heading_title`, `product.price`, `product.special`, `product.options`, `product.images[i].image/.popup`, `product.description`). One correctness fix: in `commitAddToCart` keep the existing `productId ?? product.product_id` (line 87) so the cart line key is stable. Note `product.special` is `false` (not a string) when there's no sale — the existing `!!product.special && product.special !== product.price` guard (line 64) handles that.

### 4.3 CatalogScreen (category view) — live products with HTML fallback

Only the `if (categoryId) { ... }` branch (lines 165–174) changes. The grid picker (`CATALOG_DATA`, `CatalogTopTabs`/`CatalogSidebar`/`CatalogItemGrid`) stays static — there is **no** storefront endpoint for that picker.

```js
import apiRequest from '../../api/apiclient';
import { API_ENDPOINTS } from '../../api/const';
import { setPage } from '../../store/pageSlice';

const [products, setProducts] = useState(null);

useEffect(() => {
  if (!categoryId) return;
  let alive = true;
  (async () => {
    dispatch(setPage({ name: 'catalog', loading: true }));

    // PRIMARY: product/search is reliably structured.
    let res = await apiRequest({
      url: `/${API_ENDPOINTS.PRODUCT_SEARCH}&search=&category_id=${categoryId}`,
    });

    // FALLBACK: product/category (may return HTML — only use if structured).
    if (!res.data?.products || typeof res.data.products === 'string') {
      const cat = await apiRequest({ url: `/index.php?route=product/category&path=${categoryId}` });
      if (cat.data?.products && typeof cat.data.products !== 'string') res = cat;
    }

    if (alive && res.data?.products && typeof res.data.products !== 'string') {
      setProducts(res.data.products);
      dispatch(setPage({ name: 'catalog', data: res.data, loading: false, error: null }));
    } else if (alive) {
      console.warn('Category returned HTML / no products', categoryId);
      dispatch(setPage({ name: 'catalog', loading: false, error: 'No structured products' }));
    }
  })();
  return () => { alive = false; };
}, [categoryId]);

if (categoryId) {
  return (
    <ProductGrid
      key={categoryId}
      products={products ?? {}}     // was FALLBACK_PRODUCTS
      title={categoryName ?? ''}
      scroll={false}
    />
  );
}
```

`ProductGrid` already accepts either an object map or array via `Object.values()` in `mapProducts`.

### 4.4 SearchScreen — add the missing input, then query

`SearchScreen.js` has **no search box** today; it renders `PopularSearches` / `PopularCurations` and pipes `product.json` into `ProductGrid` (lines 7, 154, 160). Add a `TextInput`, capture `searchTerm`, and call the API.

```js
import { TextInput } from 'react-native';
import apiRequest from '../api/apiclient';
import { API_ENDPOINTS } from '../api/const';
import { setPage } from '../store/pageSlice';
// remove: import productData from './../data/product.json';

const [searchTerm, setSearchTerm] = useState('');
const [products, setProducts]     = useState(null);

useEffect(() => {
  const term = searchTerm.trim();
  if (!term) { setProducts(null); return; }
  let alive = true;
  const t = setTimeout(async () => {            // debounce keystrokes
    dispatch(setPage({ name: 'search', loading: true }));
    const { data, error } = await apiRequest({
      url: `/${API_ENDPOINTS.PRODUCT_SEARCH}&search=${encodeURIComponent(term)}`,
    });
    if (alive && data) {
      setProducts(data.products);
      dispatch(setPage({ name: 'search', data, loading: false, error: null }));
    } else if (alive) {
      dispatch(setPage({ name: 'search', loading: false, error: error || 'Search failed' }));
    }
  }, 350);
  return () => { alive = false; clearTimeout(t); };
}, [searchTerm, dispatch]);

// In render: <TextInput value={searchTerm} onChangeText={setSearchTerm} placeholder="Search products" />
// Then feed live results: <ProductGrid products={products} title="" scroll={false} />
// Show PopularSearches/PopularCurations only when searchTerm is empty.
```

---

## 5. Cart / Checkout / Account API (classic `catalog/api/*`)

This is backend **System B** — a **stateful, server-session** flow. Each step writes into the server session; later steps depend on earlier ones. The RN app today does **none** of this: the cart is a local Redux slice (`cartSlice.js`) and there is no checkout/account network code. The sections below are the spec to build against.

### 5.1 Auth / session flow

Two mechanisms coexist:

1. **Signature auth (HMAC-SHA1)** — only `api/order` and `api/subscription` are whitelisted as entry points (`startup/api.php`). All other `api/*` routes return **403** unless invoked *through* those controllers. Required GET params: `route, call, username, store_id, language, currency, time, signature`. The server looks up the API user by `username`, checks the caller IP is in the **IP whitelist**, validates the request `time` is within **450 s (7.5 min)** of server time, then verifies `signature = base64(hmac_sha1(stringToSign, api_key))`. The string-to-sign concatenates: `route + call + username + HTTP_HOST + PHP_SELF + store_id + language + currency + md5(POST_body) + unix_timestamp`. Every call is logged to `oc_api_history`.
2. **Session token auth (`api_token`)** — for all other `api/*` routes. You obtain an `api_token` (via the signature-authenticated startup), then pass it as the `api_token` GET param. The server validates it against `oc_api_session` **and** requires the request IP to match the IP that minted the token. TTL is **1 hour**; stale sessions are auto-cleaned.

> **Practical takeaway:** Direct browser/device calls to `api/cart`, `api/customer`, `api/payment_address`, etc. are **403** on their own. Drive everything through `api/order?call=...` (which internally delegates to those controllers) using a server-obtained `api_token`. The HMAC signing + IP whitelist means the *origination* of the token typically happens server-side; do not embed the API secret key in the mobile binary.

### 5.2 Endpoint table (the calls you'll actually make via `api/order`)

| Route / call | Method | Params | Response |
|---|---|---|---|
| `api/order&call=customer` | POST | `customer_id, customer_group_id, firstname, lastname, email, telephone, custom_field{}` | `{success}` \| `{error}` |
| `api/order&call=product_add` | POST | `product_id, quantity, option{}, subscription_plan_id` | `{success, products[], totals[], shipping_required}` \| `{error}` |
| `api/order&call=cart` | POST | `product[]` | `{success, products[], totals[], shipping_required}` \| `{error}` |
| `api/order&call=payment_address` | POST | `payment_firstname, payment_lastname, payment_address_1, payment_postcode, payment_city, payment_country_id, payment_zone_id, payment_custom_field{}` | `{success}` \| `{error}` |
| `api/order&call=shipping_address` | POST | `shipping_*` (mirrors payment) | `{success}` \| `{error}` |
| `api/order&call=shipping_methods` | GET | none (needs customer + cart + addresses) | `{shipping_methods:[{code,name,cost,text,...}]}` \| `{error}` |
| `api/order&call=shipping_method` | POST | `shipping_method:{name,code,cost,tax_class_id}` | `{success, products, totals, shipping_required}` \| `{error}` |
| `api/order&call=payment_methods` | GET | none (needs prior steps) | `{payment_methods:[{code,name,...}]}` \| `{error}` |
| `api/order&call=payment_method` | POST | `payment_method:{name,code}` | `{success, ...}` \| `{error}` |
| `api/order&call=affiliate` | POST | `affiliate_id` (optional) | `{success}` \| `{error}` |
| `api/order&call=extension&code=...` | POST | extension-specific (discounts/rewards/gift cards) | `{[code]:{...}, products, totals, shipping_required}` |
| `api/order&call=confirm` | POST | `order_id` (0 = new), `comment`, `order_status_id` (+ all prior POST data) | `{order_id, success, points, commission, products, totals, shipping_required}` \| `{error{...}}` |
| `api/order&call=history_add` | POST | `order_id, order_status_id, comment, notify, override` | `{success}` \| `{error}` |

Underlying controllers (`api/cart` get-products/get-totals, `api/customer`, `api/payment_address`, `api/shipping_address`, `api/shipping_method`, `api/payment_method`) exist but are reached **through** `api/order`. The `api/cart` total/product getters return cart state where each total has `{code, title, value (raw), text (formatted currency)}`.

### 5.3 Ordered checkout sequence

1. **Initiate session** — server-side: authenticate with username/key (HMAC-SHA1) → obtain `api_token`; pass it on every subsequent call.
2. **Set customer** — `POST api/order&call=customer`.
3. **Set payment address** (if `config_checkout_payment_address`) — `POST api/order&call=payment_address`.
4. **Add products** — `POST api/order&call=product_add` (per product) or `call=cart` (batch).
5. **Set shipping address** (if `cart.hasShipping()`) — `POST api/order&call=shipping_address`.
6. **Get shipping methods** — `GET api/order&call=shipping_methods`.
7. **Set shipping method** — `POST api/order&call=shipping_method`.
8. **Get payment methods** — `GET api/order&call=payment_methods`.
9. **Set payment method** — `POST api/order&call=payment_method`.
10. **(Optional)** apply affiliate / extension — `call=affiliate` or `call=extension&code=...`.
11. **Confirm** — `POST api/order&call=confirm` with `order_id=0`. Validates all prerequisites, creates the order, returns the new `order_id` + totals.

> **Confirm does NOT take payment.** It only creates the order record. Actual payment is the gateway's job, handled separately.

### 5.4 Mapping to RN screens (current state — be honest)

| RN surface | Today | To build |
|---|---|---|
| Add-to-cart (`ProductView.commitAddToCart`) | Local-only `dispatch(addToCart(...))` into `cartSlice` | Also `POST api/order&call=product_add` so the **server** cart matches |
| Cart screen / `cartSlice` | Pure local `useState`/Redux; totals computed client-side via `selectCartSubtotal` etc. | Reconcile with server `getProducts`/`getTotals`; server totals are authoritative |
| Auth / account | **Not implemented** (no login screen wired to API) | `POST api/order&call=customer` to establish the checkout customer; full account/login is out of scope of the storefront/checkout APIs above |
| Checkout (addresses, methods, confirm) | **Stubbed / absent** | Build steps 3–11 above; manage server session token |

**Stubbed honestly:** there is currently **no** checkout, **no** address capture, **no** server cart sync, and **no** order confirmation in the app. The cart is entirely client-side and will be lost on session timeout once you move to the server cart (cart lives in the server session, not the DB).

### 5.5 Known backend bugs to defend against

- `api/subscription` `history_add` calls `model_checkout_order->addHistory` instead of the subscription model — subscription history will misbehave. Avoid relying on it.
- `api/payment_method` `index()` reads `payment_method.name` nested, but the input keys `name`/`code` are top-level → undefined-offset error. Send the shape the controller actually reads and test carefully.
- Minimum-quantity validation only fires on `call=confirm`, not on `product_add` — a too-low quantity can sneak in until confirm rejects it.
- Subscription products **require** `subscription_plan_id`; omitting it fails the add.

---

## 6. Data mapping cheatsheet

### 6.1 Product detail (`product/product`) → ProductView

| API field | Type | RN usage |
|---|---|---|
| `heading_title` | string | `product.heading_title` (title, cart name, share) |
| `product_id` | string/int | cart line id (`productId ?? product.product_id`) |
| `price` | **formatted string** `"$969.80"` | shown directly; `parsePrice()` for math |
| `special` | string \| `false` | sale price; `false` ⇒ no sale |
| `tax` | formatted string | mapped to "oldPrice" in grids (see note) |
| `images[]` | `{thumb, thumb2x, popup, popup2x}` | carousel: `img.image \|\| img.popup` (use `popup`/`thumb`) |
| `thumb` | string | primary thumbnail |
| `description` | HTML string | `stripHtml(product.description)` |
| `options` | array | `OptionsSelector`, required-option gating |
| `attribute_groups` | array | spec/attribute display |
| `related` | array | "related products" rail |
| `rating`, `review`, `reviews[]` | mixed | review section (note `reviews` vs `review`) |
| `stock`, `minimum`, `manufacturer`, `model`, `reward`, `points`, `discounts`, `subscription_plans`, `tags`, `share` | mixed | detail extras |

> ProductView carousel reads `img.image || img.popup` (line 143), but the API delivers `{thumb, thumb2x, popup, popup2x}` — there is **no `image` key** on product-detail images. Either map `popup`→`image` or change the carousel to read `img.popup`/`img.thumb`.

### 6.2 Product card (search / category / special) → `productGrid.mapProducts`

API per-product card fields: `product_id, name, thumb, thumb2x, price, special, tax, rating, href, labels`.

| API field | `mapProducts` → RN card prop |
|---|---|
| `product_id` | `id: parseInt(product.product_id, 10)` |
| `name` | `name` |
| `thumb` | `image` |
| `price` | `price` (formatted string) |
| `tax` | `oldPrice` *(current mapping — likely should be the strikethrough/RRP; verify)* |
| `special` | `special` |
| `labels` | `labels` (badge chips) |

### 6.3 Category / search envelope → CatalogScreen / SearchScreen

`product/search` & `product/category` return: `products` (array **or HTML string**), `heading_title`, `breadcrumbs`, plus search/sort facets (`search, category_id, sort, order, limit, results, sorts, categories, limits`).

### 6.4 Layout module `item.data` → `componentMap` (HomeScreen)

`componentMap` keys: `master_slider`/`slider` → `MasterSlider`, `products` → `Products`, `info_blocks` → `InfoBlocks`, `banners` → `Banner`, `categories` → `Category`, `title` → `Title`.

> **`item.data` note:** the shape of `item.item.data` depends on the module type — `products` modules expose a `result` array, `slider`/`master_slider` expose `items`/`images`, `banners` expose an `items` array of `{href, target}`. `MasterSlider.mapSlides` already digs the image out of nested `items` of type `image`. When you go live, confirm each module renderer reads the *live* `data` shape (it matches the fixture, since `home.json` is a saved live response).

---

## 7. Gotchas & caveats

- **Broken image getter (highest-impact bug).** `src/utils/getImage.js` `getPlaceholderImage()` **always** returns a `placehold.co` URL — the real-image branch (lines 12–21) is **commented out**. Every image in the app (home sliders, product cards, categories) is a gray placeholder. **Uncomment lines 12–21** so real image URLs pass through. Until you do, live integration will still show placeholders even though the API returns real art.
- **Category endpoint returns HTML.** `product/category&path={id}` sometimes returns `products` as a **~97 KB pre-rendered HTML string** (observed at `path=104` "Mobile") instead of a structured array — an FPC / product-thumb-collector interaction. **Prefer `product/search&category_id=`**; only accept `product/category` results when `typeof products !== 'string'`. Invalid ids (e.g. `path=20`) can return a **404 HTML** page.
- **Dropped `productId` in ProductView.** `ProductView` extracts `route.params.productId` but ignores it (uses the fixture). `productGrid` *does* navigate with `{ productId: ProductGrid.id }` (line 21), so the id arrives — ProductView just never fetches with it. Section 4.2 fixes this. Ensure `mapProducts` keeps `id: parseInt(product.product_id, 10)` so the id is non-null.
- **`journal3/` prefix.** Never send `journal3/` in your route. Call `index.php?route=common/home`; the backend strips/re-adds the prefix and you only *see* it in `_storefront.route`.
- **Prices are formatted strings.** `price`/`special`/`tax` are `"$969.80"`-style strings. Display as-is; use `parsePrice()` (in `src/utils/formatPrice.js` and `cartSlice.js`) for any arithmetic. `special` is `false` when there is no sale — don't treat it as a number.
- **`null` layout.** `_storefront.layout` can be `null` (Journal3 inactive). `renderSection` already returns `null` for missing rows; keep that guard.
- **FPC (Full Page Cache).** Responses may be cache-served. Watch for an `X-FPC` response header indicating a cache hit. To force a fresh response during debugging, send **`X-OC-FPC: bypass`**. Cold cache (first request) can be 20–30% slower while module caches warm; that's expected. (Note: in this dev container, a missing `storage/cache/<host>/` dir prints PHP warnings before the JSON — see Appendix.)
- **`href` may be relative or absolute.** Card/banner `href` values are not normalized — resolve against `API_DOMAIN` before using as navigation/links.
- **Dev vs prod API key.** Dev: `config_storefront_api_key` empty ⇒ gate open, any non-empty `X-OC-Storefront-App` passes. Prod: the config key is set ⇒ your header **must match exactly** or you get `401`. Keep `STOREFRONT_APP_KEY` in `const.ts` and swap per environment.
- **Storefront vs Admin API.** Storefront JSON API (System A, `X-OC-Storefront-App`) and classic `api/*` (System B) are for the mobile app. The **Admin React API (`/alpha/*`, `X-OC-React-Admin`) is off-limits** — never call it.
- **Fixture shape mismatch.** `home.json` is a full `_storefront` envelope (so the home engine is already correct). But `productView.json` and `product.json` are **bare data**, not envelopes — when you go live, map the *response root* to the same field names those fixtures used (ProductView reads `data`, not `data._storefront`).
- **No loading/error UI.** `pageSlice` has `loading`/`error` fields but no screen renders spinners/toasts. Wire `dispatch(setPage({ loading: ... }))` (shown in §4) and add `useSelector(s => s.page[name]?.loading)`-driven UI.
- **Checkout session fragility.** Cart lives in the **server session**, not the DB — session timeout loses it. The `api_token` is **IP-bound** and **1-hour TTL**. Signature requests need clock sync within **7.5 min**.

---

## 8. Step-by-step rollout checklist

Migrate lowest-risk (read-only) → highest-risk (writes). Each item is independently shippable.

**Phase 0 — Client plumbing**

- [ ] Update `src/api/apiclient.ts`: `baseURL` → `API_DOMAIN` (no `?mp=1`); inject `X-OC-Storefront-App: STOREFRONT_APP_KEY` on every request (§2.1).
- [ ] Rewrite `src/api/const.ts`: real `API_DOMAIN`, `STOREFRONT_APP_KEY`, `API_ENDPOINTS` (§2.2). For device/emulator use `10.0.2.2`/LAN IP, not `localhost`.
- [ ] **Fix `src/utils/getImage.js`** — uncomment the real-image branch (lines 12–21) so live art renders, not placeholders.
- [ ] Sanity-check each route with the curl commands in §3.5.

**Phase 1 — HomeScreen (read-only, lowest risk)**

- [ ] Replace the `home.json` import with a live `common/home` fetch (`fetchLayout`); feed `_storefront.layout.top/bottom.rows` to the unchanged `renderSection` (§4.1).
- [ ] Wire `onRefresh` and the `useEffect` to actually call `fetchLayout`; dispatch `setPage({ name:'home', ... })`.
- [ ] Verify every module type in the live layout has a `componentMap` entry and renders.

**Phase 2 — ProductView (read-only)**

- [ ] Drop the `productView.json` import; fetch `product/product&product_id={productId}` in a `useEffect` keyed on `productId` (§4.2).
- [ ] Fix the image carousel to read `img.popup`/`img.thumb` (no `image` key on product images).
- [ ] Confirm `productId` threads correctly into `addToCart` (`productId ?? product.product_id`).

**Phase 3 — Catalog category view (read-only)**

- [ ] In the `if (categoryId)` branch, fetch `product/search&category_id={id}`; fall back to `product/category&path={id}` **only if** `products` is structured (§4.3).
- [ ] Detect/guard the HTML-string `products` case; log + show empty state.
- [ ] Keep `CATALOG_DATA` grid picker static (no endpoint).

**Phase 4 — Search (read-only + new UI)**

- [ ] Add a `TextInput` + debounced `searchTerm` state; query `product/search&search={term}` (§4.4).
- [ ] Show `PopularSearches`/`PopularCurations` only when the query is empty; show live `ProductGrid` otherwise.
- [ ] Remove the `product.json` fixture import.

**Phase 5 — Cross-cutting polish**

- [ ] Add loading spinners / error toasts driven by `pageSlice` `loading`/`error` (§7).
- [ ] Normalize `href` values against `API_DOMAIN`.
- [ ] Confirm `parsePrice()` is used everywhere a number is needed; never math on the formatted string.

**Phase 6 — Cart sync (first writes)**

- [ ] Stand up server-session bootstrap (obtain `api_token` server-side; never embed the secret in the app).
- [ ] On add-to-cart, mirror the local `cartSlice` add with `POST api/order&call=product_add`.
- [ ] Reconcile cart display with server `getProducts`/`getTotals` (server totals authoritative).

**Phase 7 — Checkout writes (highest risk, last)**

- [ ] Build the §5.3 sequence: customer → payment address → shipping address → shipping methods/method → payment methods/method → (optional affiliate/extension) → **confirm**.
- [ ] Handle the known backend bugs (§5.5): payment-method shape, subscription `history_add`, min-qty only validated on confirm.
- [ ] Validate clock sync (≤7.5 min) and IP-stable token before going to production; account for 1-hour token TTL and session-bound cart.

---

## Appendix — Relevant files

**RN app (this repo):**

- `src/api/apiclient.ts` — the axios wrapper (`apiRequest`); fix `baseURL` + header here.
- `src/api/const.ts` — base URL, storefront key, endpoint constants.
- `src/Tabs/Home/HomeScreen.js` — home layout engine (`renderSection`, `componentMap`).
- `src/screens/ProductView.js` — product detail; currently ignores `productId`.
- `src/Tabs/Catalog/CatalogScreen.js` — category grid picker + category product view.
- `src/screens/SearchScreen.js` — needs a search input; currently fixture-only.
- `src/modules/index.js` — `componentMap` (module-type → component).
- `src/modules/productGrid.js` — `mapProducts` card mapping.
- `src/modules/MasterSlider.js` — slider data mapping.
- `src/utils/getImage.js` — **broken** placeholder getter (must fix).
- `src/utils/formatPrice.js` — `formatPrice` / `parsePrice` (string→number).
- `src/store/pageSlice.js` — `setPage({ name, data, loading, error })` for per-screen state.
- `src/store/cartSlice.js` — local cart (client-side only today).
- `src/data/home.json` — a saved `common/home` storefront response (reference shape).
- `src/data/productView.json`, `src/data/product.json` — bare-data fixtures (not envelopes).

**Backend (`/home/verma/code/brandwik`, WSL Ubuntu):**

- `catalog/controller/event/storefront_api.php` — the Storefront JSON API handler (4 gates, envelope, whitelist).
- `system/config/catalog.php` — event registration (`view/*/before` @ priority 1000) + `api/*` route wiring.
- `catalog/controller/api/{cart,order,customer,payment_address,shipping_address,payment_method,shipping_method,subscription}.php` — classic checkout API.
- `catalog/controller/startup/api.php` — `api/*` signature + session-token auth.
- `.claude/STOREFRONT_API_QUICK_REFERENCE.md`, `.claude/STOREFRONT_API_IMPLEMENTATION.md`, `.claude/STOREFRONT_API_MODULE_SETTINGS.md`, `.claude/agents/storefront-api-helper.md` — backend's own API docs.

> **Dev-server note:** the running container currently emits PHP `file_put_contents(... storage/cache/<host>/...)` warnings (a missing per-host cache dir) that get prepended to the JSON body and can break a strict JSON parse. If a client throws on parse, strip everything before the first `{` (or have the backend owner create `storage/cache/<host>/`). This is an environment glitch, not an API contract.

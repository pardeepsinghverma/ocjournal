# ocjournal — App Flow & Improvement Reference

> Map of how this React Native e-commerce app is wired — boot → navigation → screens → state → data → improvement roadmap. **Verified against current source on branch `aistore3` (2026-06-09).** This supersedes earlier drafts: the app has materially evolved since (persisted cart/auth/coupon Redux, a coupon engine, a 3-pane Catalog, and a real OpenCart/Journal3 backend integration for category listings). Re-verify against source before acting on any single line.

**TL;DR of where it stands:** Cart → coupon → address → payment → order is a *complete, persisted, client-side* flow. Catalog now fetches *real* products from the backend. But two showstoppers gut the experience: **(1)** [ProductView](src/screens/ProductView.js) ignores the `productId` it's given and always shows the same fixture product, so the catalog's real data dead-ends; **(2)** [getImage.js](src/utils/getImage.js) always returns a gray placeholder, so every home/catalog image is blank. Fix those two and the app goes from "demo" to "usable".

---

## 1. Boot Sequence

1. [index.js](index.js) registers the **root** [App.js](App.js) with React Native; `enableScreens()` runs at module load.
2. **Root [App.js](App.js)** is the provider wrapper. Nesting (outer → inner):
   - `TamaguiProvider` (config `@tamagui/config/v3`)
   - `PortalProvider` (Tamagui portals)
   - `Provider` (Redux store)
   - `PersistGate loading={null}` (redux-persist rehydration)
   - renders [src/App.js](src/App.js)
3. **[src/App.js](src/App.js)** wraps the tree in `GestureHandlerRootView` + a **second** Redux `Provider` (redundant), then renders `AppContainer`.
4. `AppContainer` ([src/App.js:27-70](src/App.js#L27)):
   - On mount, installs deep-link listeners via [handleDeepLinkSetup](src/linking/handlers.js).
   - Renders a `NavigationContainer` with `linking` from [linkingConfig.js](src/navigation/linkingConfig.js) wrapping the root native stack.

### Boot-level issues
- **Redundant Redux `Provider`** — wrapped in both [App.js](App.js) and [src/App.js:75](src/App.js#L75). Harmless (same `store` singleton) but a smell.
- **No rehydration gate** — `PersistGate loading={null}` ([App.js](App.js)) shows a blank frame while AsyncStorage rehydrates. Now user-visible because cart/auth/orders are persisted.
- **Dead selector** — [src/App.js:28](src/App.js#L28) reads `state.data.subDomain`, a key that is **never set** (the slice only ever writes `currentSubDomain`). `subDomainRedux` is permanently `undefined`; it feeds only a `console.log`.
- **No error boundary** anywhere in the provider tree.

---

## 2. Navigation Topology

### 2.1 Root native stack — [src/App.js:48-67](src/App.js#L48)

`initialRouteName="main"`. Global `screenOptions`: `headerBackVisible:false` + `headerLeft: () => <HeaderBackButton/>`.

| Route (lowercase) | Component | Options | Reached from |
|---|---|---|---|
| `main` | [DrawerNavigator](src/navigation/DrawerNavigator.js) | `headerShown:false` | initial |
| `catalog` | [CatalogScreen](src/Tabs/Catalog/CatalogScreen.js) | default header | drawer, category/banner/slider taps, self-push |
| `productView` | [ProductView](src/screens/ProductView.js) | `headerTitle:""` | product cards, drawer "New Product" |
| `checkoutNavigation` | [CheckoutNavigation](src/screens/checkout/CheckoutNavigation.js) | `headerShown:false` | Cart → AddressSheet confirm |
| `myorders` | [MyOrders](src/screens/profile/MyOrders.js) | default | profile menu, drawer, post-order reset |
| `myaddresses` | [MyAddresses](src/screens/profile/MyAddresses.js) | default | profile menu, Cart (no address), Payment "CHANGE" |
| `myprofile` | [MyProfile](src/screens/profile/MyProfile.js) | default | profile menu, drawer |
| `login` | [Login](src/screens/auth/Login.js) | default | drawer (unauth), MyProfile auth-guard |
| `search` | [SearchScreen](src/screens/SearchScreen.js) | `headerTitle: <SearchHeader/>` | HeaderActions search, drawer |
| `wishlist` | [Wishlist](src/screens/Wishlist.js) | default | HeaderActions, Cart heart |
| `cart` | [Cart](src/screens/checkout/Cart.js) | `headerShown:false` | HeaderActions cart, ProductView |
| `notification` | [Notification](src/screens/Notification.js) | default | HeaderActions bell |

> **Naming convention:** stack routes are lowercase; tab/drawer screens are PascalCase.

### 2.2 Drawer — `main` route — [DrawerNavigator.js](src/navigation/DrawerNavigator.js)

- Hosts a single screen `MainTabs` → [BottomTabNavigator](src/navigation/BottomTabNavigator.js).
- Header: gold `#febf00`, [HeaderLogo](src/components/HeaderLogo.js) title, right actions `['search','bell','wishlist','cart']`.
- `CustomDrawerContent` menu is **auth-aware** (`state.auth.isAuthenticated`): Login/Logout, Search, New Product, My Orders, My Addresses, My Profile, Catalog, plus a collapsible "Popular" accordion ([MAccordion](src/components/MAccordion.js)).
- **Bug:** `drawerItemStyle` is declared **twice** in `screenOptions` ([DrawerNavigator.js:138-152](src/navigation/DrawerNavigator.js#L138)); the second (`backgroundColor:'#000000'`) wins → black rows behind the text.

### 2.3 Bottom tabs — [BottomTabNavigator.js](src/navigation/BottomTabNavigator.js)

| Tab | Component | Icon |
|---|---|---|
| Home | [HomeScreen](src/Tabs/Home/HomeScreen.js) | `House` |
| Catalog | [CatalogScreen](src/Tabs/Catalog/CatalogScreen.js) | `ShoppingBasket` |
| Profile | [ProfileScreen](src/Tabs/ProfileScreen.js) | `UserRound` |
| More | [MoreScreen](src/Tabs/MoreScreen.js) | `EllipsisVertical` |
| **Store** | MoreScreen *(never renders)* | dynamic CDN logo by subdomain |

**Store switcher:** the Store tab's `tabPress` calls `e.preventDefault()` and opens a Tamagui `Sheet` of **hardcoded** subdomains ("replace with API later"). Selecting dispatches `setData({ name: 'currentSubDomain', data: value })`. The tab icon and [HeaderLogo](src/components/HeaderLogo.js) correctly read `currentSubDomain`.

### 2.4 CheckoutNavigation — [CheckoutNavigation.js](src/screens/checkout/CheckoutNavigation.js)

Nested native stack, `headerShown:false`: `cart` → `address` → `payment`. **The `address` page is unreachable in practice** — the real flow uses an `AddressSheet` modal from [Cart](src/screens/checkout/Cart.js) that jumps straight to `payment`.

### 2.5 Dead navigators / duplicates

- [stackNavigator.js](src/navigation/stackNavigator.js) — imported in [src/App.js:8](src/App.js#L8) but **never rendered**.
- [ProfileNavigation.js](src/screens/profile/ProfileNavigation.js) — imported in [src/App.js:14](src/App.js#L14) but **never added as a screen**. The Profile tab navigates to root-stack `myorders`/`myaddresses`/`myprofile` directly.
- [src/screens/profile/Profile.js](src/screens/profile/Profile.js) — a dead duplicate of [Tabs/ProfileScreen.js](src/Tabs/ProfileScreen.js).

### 2.6 Headers

- [AppHeader.js](src/components/AppHeader.js) — custom header for `headerShown:false` screens (Cart, Payment); back via [IoChevronBackOutline](src/components/icons/IoChevronBackOutline.js) + `goBack()`.
- [HeaderActions.js](src/components/HeaderActions.js) — search/share/bell/wishlist/cart toolbar; cart badge reads `selectCartCount`.
- [HeaderBackButton.js](src/components/HeaderBackButton.js) — global stack `headerLeft`; auto-hides when `!canGoBack`.
- [HeaderLogo.js](src/components/HeaderLogo.js) — subdomain-aware CDN logo.
- [HeaderSearch.js](src/components/HeaderSearch.js) — input in the `search` header; submit re-navigates `search` with `{query}` — but `SearchScreen` never reads it (see §9).

---

## 3. Deep Linking

Two parallel mechanisms coexist:

- **[linkingConfig.js](src/navigation/linkingConfig.js)** — React Navigation `linking`. Prefixes **mix schemes**: `['ocjournal://','example://','https://example.com','http://example.com']`. Maps `main → subdomain/:subdomain`, `productView → product/:productId`, `catalog → catalog/:categoryId?`, plus `search/wishlist/cart/login`.
- **[handlers.js](src/linking/handlers.js)** — `handleDeepLinkSetup(dispatch)` installs a runtime `Linking` listener **and** a cold-start `getInitialURL()`. `parseUrl` only understands `subdomain/<x>` and dispatches `setData({ name: 'currentSubDomain' })`.

**Defects:** scheme drift (`example://` still listed); possible **double-dispatch** of the subdomain on cold start (both mechanisms fire); the `product/:productId` link is inert because ProductView ignores the id (§9).

---

## 4. State Management — Redux

[store.js](src/store/store.js): `combineReducers({ page, data, auth, cart, coupon })`, persisted via redux-persist (`key:"root"`, AsyncStorage), **`whitelist: ["data","auth","cart","coupon"]`** (`page` is intentionally not persisted). No thunks/custom middleware.

| Slice | Shape | Persisted | Status |
|---|---|---|---|
| [data](src/store/dataSlice.js) | `{ currentSubDomain, subDomains[] }` | ✅ | active — generic `setData({name,data})` |
| [page](src/store/pageSlice.js) | `{ [name]: {data,loading,error} }` | ❌ | **dormant** — `setPage` never dispatched anywhere |
| [auth](src/store/authSlice.js) | `{ isAuthenticated, user, addresses[], orders[] }` | ✅ | active |
| [cart](src/store/cartSlice.js) | `{ items[], pincode }` | ✅ | active |
| [coupon](src/store/couponSlice.js) | `{ applied, error }` + `AVAILABLE_COUPONS` | ✅ | active (engine) |

### auth — [authSlice.js](src/store/authSlice.js)
Reducers: `setUser` (no validation/hashing/API), `updateUser`, `logout`, `placeOrder` (builds orders **client-side**, `genId()`, `status:'Placed'`), `addAddress` (first auto-default), `updateAddress`, `deleteAddress`, `setDefaultAddress`. **Writers:** Login, MyProfile, MyAddresses, Payment, AddressSheet/Address. **Readers:** Drawer, Cart, Payment, MyAddresses, MyOrders, MyProfile.
- ⚠️ `logout` wipes `addresses` + `orders` — destructive for guest data.

### cart — [cartSlice.js](src/store/cartSlice.js)
Items keyed by `cartLineKey(productId, sortedSelectedOptions)` so each option-combo is a distinct line (good design). `addToCart` precomputes `priceValue`/`listPriceValue` via `parsePrice` and only keeps a strikethrough when `listPrice > price`. Selectors: `selectCartCount/Subtotal/ListTotal/Savings`. **Writers:** ProductView (add), Cart (qty/remove/pincode), Payment (clear). **Readers:** Cart, Payment, HeaderActions, CouponCard/Sheet.

### coupon — [couponSlice.js](src/store/couponSlice.js)
Hardcoded `AVAILABLE_COUPONS` (GETCASH10 %+cap, FLAT100 flat, WELCOME50 flat). `selectCouponDiscount` enforces `minOrder`, caps percent by `maxDiscount`, clamps flat to subtotal. `selectCouponEligible(coupon)` is a selector factory. [Cart](src/screens/checkout/Cart.js) auto-removes a coupon when subtotal drops below `minOrder` (nice). ⚠️ Re-derives subtotal locally — **duplicates** `selectCartSubtotal`.

---

## 5. API & Data Layer

- **[apiclient.ts](src/api/apiclient.ts)** — `apiRequest({ url, method, data, params, headers })` over axios. `baseURL = API_DOMAIN`; **always injects `X-OC-Storefront-App: STOREFRONT_APP_KEY`**; 10s timeout; returns `{ data }` or `{ error, status }`.
- **[const.ts](src/api/const.ts)** — single source of truth: `API_DOMAIN = 'http://10.0.2.2:8080'` (Android-emulator host for the WSL backend), `STOREFRONT_APP_KEY = 'testkey'`, `STOREFRONT_ROUTE`, and `API_ENDPOINTS` (`COMMON_HOME`, `PRODUCT`, `PRODUCT_CATEGORY`, `PRODUCT_SEARCH`, `PRODUCT_SPECIAL`, `INFORMATION`).
- **[storefront.js](src/api/storefront.js)** — the **only live integration**. `getCategoryProducts(categoryId)`: the Journal3 backend returns a category's product list as a **pre-rendered HTML string** (not an array), so it (1) GETs `product/category&path={id}`, (2) regex-scrapes unique `product_id`s, (3) hydrates each in parallel via `product/product`, (4) maps detail → card. Future-proofed to short-circuit if a real array ever appears.

> Backend context lives in [docs/Backend-API-Integration-Guide.md](docs/Backend-API-Integration-Guide.md): an OpenCart 4.1 / Journal3 instance in WSL. The classic `catalog/api/*` write system (cart/checkout/account) is **un-integrated** — all such writes are local Redux.

### Live vs static

| Surface | Source |
|---|---|
| Home layout | **Static** [home.json](src/data/home.json) |
| Catalog **products** (a category) | **Live** `getCategoryProducts` |
| Catalog **taxonomy/tiles** | **Static** hardcoded `CATALOG_DATA` (with real backend category ids) |
| Product detail | **Static** [productView.json](src/data/productView.json) — `productId` ignored for rendering |
| Coupons | **Static** `AVAILABLE_COUPONS` |
| Orders / auth / addresses | **Local** Redux only (no backend) |

---

## 6. Home Layout Engine — [HomeScreen.js](src/Tabs/Home/HomeScreen.js)

1. Loads static [home.json](src/data/home.json) into local `useState`, split into `_storefront.layout.top.rows` and `…bottom.rows`. The live `common/home` fetch (`fetchLayout`) is **fully commented out**; `API_ENDPOINTS.COMMON_HOME` is unused.
2. `renderSection(rows)` walks 3 levels — `rows → columns[].items → items[]` — reads `item.item.type`, looks it up in [componentMap](src/modules/index.js), and renders `<Module data={item.item.data.items || []} options={item.item.data} />`.

**Issues:** pull-to-refresh is a **no-op** (the `RefreshControl` is wired to the commented-out `fetchLayout`); the wrapper `<View marginTop={10}>` and the nested `.map()`s are **missing React keys** → key warnings; unmapped module types render `null` **silently**; the file carries many dead imports.

---

## 7. Module Catalog — [src/modules/index.js](src/modules/index.js)

`componentMap` has **9** entries:

| Layout type | Module | Notes |
|---|---|---|
| `master_slider`, `slider` | [MasterSlider](src/modules/MasterSlider.js) | normalizes nested image layers; routes images through `getPlaceholderImage` |
| `products` | [Products](src/modules/Products.js) → [productGrid](src/modules/productGrid.js) | one `ProductGrid` per data key; card tap → `productView` **with `{ productId }`** |
| `info_blocks` | [InfoBlocks](src/modules/InfoBlocks.js) | gated by `options.status`; 2-col grid |
| `banners` | [banner](src/modules/banner.js) | **now responsive** (`useWindowDimensions` + `resolveItemsPerRow`); banner links work |
| `categories` | [category](src/modules/category.js) | hardcoded `style='rounded'`; tap → `catalog`; ⚠️ **throws** on bad input |
| `title` | [Title](src/modules/Title.js) | options-only; gated by `options.status` |
| `marquee` | [Marquee](src/modules/Marquee.js) | **new** — RN `Animated` scrolling strip |
| `manufacturers` | [Manufacturers](src/modules/Manufacturers.js) | **new** — horizontal brand strip |

- **Implemented but NOT mapped:** [Testimonials.js](src/modules/Testimonials.js) is complete and correct but **absent from `componentMap`** — the one `testimonials` block in `home.json` silently disappears. *One-line fix.*
- **Documented but NOT implemented:** `home.json` also contains `grid`, `gallery`, `blog_posts`, `countdown`, `bullets` (specs exist in [docs/modules/](docs/modules/)) — all drop silently.
- **Dead module files:** [slider.js](src/modules/slider.js) (legacy), [layoutRenderer.js](src/modules/layoutRenderer.js) (demo), [product/index.js](src/modules/product/index.js) + [product/card.js](src/modules/product/card.js) (0-byte stubs).

---

## 8. Slider Stack — [src/components/Slider/](src/components/Slider/)

- [Slider.js](src/components/Slider/Slider.js) — `react-native-reanimated-carousel` in parallax mode. ⚠️ reads `options.loop/height/autoPlay` but [MasterSlider.js](src/modules/MasterSlider.js) passes `options.options` (double-nesting) → options likely always default.
- [SlideItem.js](src/components/Slider/SlideItem.js) — memoized `Animated.Image` + overlay children; `resolveSlideLink`/`navigateFromLink` route `product_id→productView`, `category_id→catalog`, href/string→url. ⚠️ adjacent-slide dimming is dead (`opacity` hardcoded to `1`).
- [render-item.js](src/components/Slider/render-item.js) — `useCallback` inside a non-component factory (Rules-of-Hooks smell).
- [ProductImageCarousel.js](src/components/Slider/ProductImageCarousel.js) + [ProductImagePagination.js](src/components/Slider/ProductImagePagination.js) — full-screen gallery + animated dots for ProductView.

---

## 9. Screen-by-Screen Reference

| Screen | Data source | Works | Stubbed / broken |
|---|---|---|---|
| **Home** [HomeScreen.js](src/Tabs/Home/HomeScreen.js) | static `home.json` | dynamic layout render; module taps route | pull-to-refresh no-op; 6 module types drop silently |
| **Catalog** [CatalogScreen.js](src/Tabs/Catalog/CatalogScreen.js) | tiles static, **products live** | 3-pane browse ([TopTabs](src/Tabs/Catalog/CatalogTopTabs.js)/[Sidebar](src/Tabs/Catalog/CatalogSidebar.js)/[ItemGrid](src/Tabs/Catalog/CatalogItemGrid.js)); live category fetch w/ loading+empty states | tile images all blank (`image:''`); needs the local backend up; N+1 hydration |
| **ProductView** [ProductView.js](src/screens/ProductView.js) | **static** `productView.json` | options + required-option enforcement; add-to-cart; confetti | **ignores `productId`** → always the same product; wishlist heart local-only |
| **Cart** [Cart.js](src/screens/checkout/Cart.js) | **Redux (persisted)** | qty/remove, coupon apply/remove + auto-remove, totals, savings, empty state | shipping hardcoded `0`; "VIEW DETAILS" inert |
| **Address (page)** [Address.js](src/screens/checkout/Address.js) | Redux | selectable list → setDefault → payment | **unreachable** (AddressSheet bypasses it) |
| **AddressSheet** [AddressSheet.js](src/components/checkout/AddressSheet.js) | Redux | real address step; confirm → payment; add/edit → myaddresses | — |
| **Payment** [Payment.js](src/screens/checkout/Payment.js) | Redux | method select, COD +35 surcharge, totals, **PAY NOW → placeOrder + clearCart + reset** | "ADD NEW CARD" empty; method not persisted |
| **Profile** [ProfileScreen.js](src/Tabs/ProfileScreen.js) | — | 3-item menu | no auth gate, no user info |
| **MyOrders** [MyOrders.js](src/screens/profile/MyOrders.js) | Redux | order cards / NoData | read-only (no detail/reorder) |
| **MyAddresses** [MyAddresses.js](src/screens/profile/MyAddresses.js) | Redux | full CRUD + default, persisted | — |
| **MyProfile** [MyProfile.js](src/screens/profile/MyProfile.js) | Redux | **auth-gated** (redirects to login); save + logout | — |
| **Login** [Login.js](src/screens/auth/Login.js) | Redux | `setUser` + `isAuthenticated:true` → back/main | no validation, no API, fake 2s submit |
| **Search** [SearchScreen.js](src/screens/SearchScreen.js) | static | renders popular chips + curations | **no search execution**; ignores `route.params.query` |
| **Wishlist** [Wishlist.js](src/screens/Wishlist.js) | — | — | pure `NoData` stub; no slice |
| **Notification** [Notification.js](src/screens/Notification.js) | — | — | pure `NoData` stub |
| **More** [MoreScreen.js](src/Tabs/MoreScreen.js) | — | — | pure text stub |

---

## 10. End-to-End User Journeys (assessed)

- **(a) Home → Product → Cart → Checkout → Order** — banners/sliders/cards/categories all route correctly *with* ids. ➜ **Dead-end:** product card passes `productId` but [ProductView](src/screens/ProductView.js) ignores it → always the fixture product. From there add-to-cart → Cart → PROCEED → (no address) `myaddresses` else `AddressSheet` → `payment` → PAY NOW → order placed, cart cleared, reset to `[main, myorders]`. **Completes end-to-end** except the wrong product detail.
- **(b) Catalog category → Product** — browse + **live product fetch** works; product card passes `productId`. ➜ Same ProductView dead-end nullifies the live data.
- **(c) Search** — header submits `{query}` ➜ [SearchScreen](src/screens/SearchScreen.js) never consumes it and never calls `PRODUCT_SEARCH`. **Dead-ends immediately.**
- **(d) Auth** — only [MyProfile](src/screens/profile/MyProfile.js) is gated. Cart/checkout/PAY NOW/MyOrders all work **without login**; you can place a guest order, and `logout` then wipes it.
- **(e) Profile → Orders/Addresses** — orders (read-only) and address CRUD both persist. **Complete** (no order detail/tracking/reorder).
- **(f) Wishlist** — ProductView heart is local-only; the `wishlist` route is an empty stub. **Entirely non-functional.**

---

## 11. Theming & Formatting

- [theme.js](src/utils/theme.js) — `colors`/`radii`/`spacing` tokens. **Well-adopted** in the newer cart/checkout/coupon layer; **not adopted** in older modules ([productGrid.js](src/modules/productGrid.js), [ProductView.js](src/screens/ProductView.js) review/price, pagination) which hardcode hex. [InfoBlocks](src/modules/InfoBlocks.js)/[Title](src/modules/Title.js) use Tamagui `$gray*` — so **three color systems coexist** and don't share values.
- [formatPrice.js](src/utils/formatPrice.js) — symbol table + `toLocaleString`. ⚠️ Always uses `en-IN` grouping for **all** currencies (USD → `$1,00,000`).
- [getImage.js](src/utils/getImage.js) — **always returns a `placehold.co` placeholder**; the real-URL branch is commented out. Affects every image routed through it (sliders, product grids, categories, banners, brands). ProductView/Cart bypass it (raw `{uri}`), so those show real images — a confusing inconsistency.
- **`parsePrice` correctness:** the `/[\d.]+/` regex (duplicated in [cartSlice.js](src/store/cartSlice.js) and [formatPrice.js](src/utils/formatPrice.js)) grabs the **first** numeric run, so `"$1,969.80"` parses as `1`. Latent corruption once comma-formatted live prices flow into cart math.

---

## 12. Dead / Unused Code

- Navigators: [stackNavigator.js](src/navigation/stackNavigator.js), [ProfileNavigation.js](src/screens/profile/ProfileNavigation.js), [profile/Profile.js](src/screens/profile/Profile.js) — imported but never rendered.
- Modules: [slider.js](src/modules/slider.js), [layoutRenderer.js](src/modules/layoutRenderer.js), [product/index.js](src/modules/product/index.js), [product/card.js](src/modules/product/card.js).
- [Testimonials.js](src/modules/Testimonials.js) — built but unregistered in `componentMap`.
- Dead imports in [HomeScreen.js](src/Tabs/Home/HomeScreen.js); legacy `RenderProductOptions` import in [ProductView.js](src/screens/ProductView.js) (uses [OptionsSelector](src/components/OptionsSelector.js) instead).
- Dormant [pageSlice.js](src/store/pageSlice.js) (`setPage` never dispatched).
- Stale docs: [docs/modules/README.md](docs/modules/README.md) lists `marquee`/`manufacturers` as unmapped (both now mapped) and frames Home as "live API" (it's fixture-driven).

---

## 13. End-to-End Navigation Map

```
index.js → App.js (Tamagui + Portal + Redux + PersistGate)
└── src/App.js (GestureHandler + Redux + NavigationContainer + deep-link effect)
    └── Stack "main" = DrawerNavigator
        └── Drawer "MainTabs" = BottomTabNavigator
            ├── Home     → HomeScreen (layout engine via componentMap)
            ├── Catalog  → CatalogScreen (browse tiles → push catalog?categoryId → live products)
            ├── Profile  → ProfileScreen → root: myorders / myaddresses / myprofile
            ├── More     → MoreScreen (stub)
            └── Store    → opens Sheet, dispatches setData(currentSubDomain)
    Other root routes:
      catalog, productView, checkoutNavigation(cart→[address dead]→payment),
      myorders, myaddresses, myprofile, login, search, wishlist, cart, notification
    Dead/unmounted: stackNavigator, ProfileNavigation, profile/Profile.js
```

---

## 14. Improvement Roadmap (prioritized)

> Consolidated across navigation, flow, state, data, and UI. Each item names the concrete fix and the file to touch.

### 🔴 Critical — unblock the core experience
1. **ProductView must resolve by `productId`.** Replace `const product = productData;` in [ProductView.js](src/screens/ProductView.js) with a fetch keyed on `route.params.productId` via a new `getProduct(id)` in [storefront.js](src/api/storefront.js) (mirror `getCategoryProducts` using `API_ENDPOINTS.PRODUCT`); keep the fixture as offline fallback. *Without this, Catalog's live data and every product link are wasted.*
2. **Restore real images** in [getImage.js](src/utils/getImage.js) — uncomment the validation branch, keep placeholder as fallback. Highest visual-impact single fix; unblocks home sliders, grids, categories, banners, brands at once.
3. **Fix `parsePrice` for thousands separators** in [cartSlice.js](src/store/cartSlice.js) and [formatPrice.js](src/utils/formatPrice.js) before live (comma) prices flow into cart math.

### 🟠 High
4. **Wire Search** — read `route.params.query` in [SearchScreen.js](src/screens/SearchScreen.js) and call a `searchProducts(query)` helper (`PRODUCT_SEARCH`), rendering results in `ProductGrid`.
5. **Register `testimonials`** (one line in [index.js](src/modules/index.js)) and decide on `grid/gallery/blog_posts/countdown/bullets` (implement or show a visible "unsupported module" placeholder so drops aren't silent).
6. **Add a rehydration gate/splash** in place of `PersistGate loading={null}` ([App.js](App.js)).
7. **Decide auth gating** — gate checkout/PAY NOW/MyOrders on `isAuthenticated`, or deliberately allow guest orders and stop `logout` from nuking `orders`/`addresses` ([authSlice.js](src/store/authSlice.js)).
8. **Collapse the dual cart entry + dead `address` page** — pick one cart surface; either route all cart entries through `checkoutNavigation`, or delete the nested `address` screen and [Address.js](src/screens/checkout/Address.js). Pass the selected address into `payment` as a param instead of relying on the `setDefaultAddress` side effect.
9. **Fix the dead subdomain selector** — [src/App.js:28](src/App.js#L28) should read `state.data.currentSubDomain`.

### 🟡 Medium
10. **Consolidate price/subtotal logic** — one `parsePrice` (export from [formatPrice.js](src/utils/formatPrice.js), import in [cartSlice.js](src/store/cartSlice.js)); have `selectCouponDiscount` reuse `selectCartSubtotal`.
11. **Build a real Wishlist slice** (persisted) and wire ProductView's heart + the `wishlist` route stub.
12. **Add React keys** in `renderSection` ([HomeScreen.js](src/Tabs/Home/HomeScreen.js)).
13. **Make `formatPrice` locale-aware per currency** (USD→`en-US`, INR→`en-IN`).
14. **Consider wiring Home to `common/home`** via `apiRequest` + the dormant [pageSlice](src/store/pageSlice.js) (gives `page` a purpose) — or formally document the fixture as intentional.
15. **Reconcile deep-link schemes** in [linkingConfig.js](src/navigation/linkingConfig.js) and de-dup the cold-start path with [handlers.js](src/linking/handlers.js).
16. **Persist the selected payment method** ([Payment.js](src/screens/checkout/Payment.js)).
17. **Remove the redundant inner Redux `Provider`** ([src/App.js:75](src/App.js#L75)).

### 🟢 Low
18. **Delete dead code** — `stackNavigator.js`, `ProfileNavigation.js`, `profile/Profile.js`, `modules/slider.js`, `modules/layoutRenderer.js`, `modules/product/*`; prune dead imports.
19. **Fix the duplicate `drawerItemStyle`** ([DrawerNavigator.js:138-152](src/navigation/DrawerNavigator.js#L138)) — black rows.
20. **Implement or remove Home pull-to-refresh.**
21. **Populate `CATALOG_DATA` tile images** (all blank) or pull the taxonomy from the backend.
22. **Adopt `theme.js` in legacy modules** ([productGrid.js](src/modules/productGrid.js), [ProductView.js](src/screens/ProductView.js)); standardize on one color system.
23. **Harden [category.js](src/modules/category.js)** — return `[]` instead of throwing on bad input; make `style`/title configurable; drop ~70 lines of commented dummy data.
24. **Add an order-detail route** from MyOrders cards.
25. **Reconcile the Slider options path** ([MasterSlider.js](src/modules/MasterSlider.js) `options.options`) and re-enable/remove the dead opacity animation ([SlideItem.js](src/components/Slider/SlideItem.js)).
26. **Refresh [docs/modules/README.md](docs/modules/README.md)** to match reality.

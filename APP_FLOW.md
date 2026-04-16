# ocjournal — App Flow Reference

> Map of how the React Native e-commerce app wires up, from boot to navigation to data. Generated as a reference snapshot; verify against source before acting on it.

## 1. Boot Sequence

1. [index.js](index.js) registers the root component with React Native.
2. [App.js](App.js) is the true root. It mounts providers, in order:
   - `TamaguiProvider` (config from `@tamagui/config/v3`)
   - `PortalProvider` (Tamagui portals)
   - `Provider` (Redux store)
   - `PersistGate` (redux-persist rehydration)
   - Renders [src/App.js](src/App.js)
3. [src/App.js](src/App.js) wraps the tree in `GestureHandlerRootView` + a second Redux `Provider`, then renders `AppContainer`.
4. `AppContainer` (inside [src/App.js](src/App.js)):
   - Subscribes to `state.data.subDomain` via `useSelector`.
   - On mount, registers deep-link listeners via [handleDeepLinkSetup](src/linking/handlers.js).
   - Wraps everything in a `NavigationContainer` with `linking` from [linkingConfig.js](src/navigation/linkingConfig.js).

> Note: Redux `Provider` is set up in both [App.js](App.js) and [src/App.js](src/App.js). Redundant — the inner one is the one that matters for screens, the outer one covers `PersistGate`.

## 2. Root Navigator — Native Stack

Defined inline in [src/App.js:47-61](src/App.js#L47-L61). Initial route: `main`.

| Route name | Component | Notes |
|------------|-----------|-------|
| `main` | [DrawerNavigator](src/navigation/DrawerNavigator.js) | Hosts the whole main app; header hidden |
| `catalog` | [CatalogScreen](src/Tabs/Catalog/CatalogScreen.js) | Also registered as a tab — both entry points |
| `productView` | [ProductView](src/screens/ProductView.js) | Product detail page |
| `checkoutNavigation` | [CheckoutNavigation](src/screens/checkout/CheckoutNavigation.js) | Nested stack: Cart → Address → Payment |
| `myorders` | [MyOrders](src/screens/profile/MyOrders.js) | Stub |
| `myaddresses` | [MyAddresses](src/screens/profile/MyAddresses.js) | Stub |
| `myprofile` | [MyProfile](src/screens/profile/MyProfile.js) | Stub |
| `login` | [Login](src/screens/auth/Login.js) | Register/login form |
| `search` | [SearchScreen](src/screens/SearchScreen.js) | Header is [HeaderSearch](src/components/HeaderSearch.js) |
| `wishlist` | [Wishlist](src/screens/Wishlist.js) | NoData placeholder |
| `cart` | [Cart](src/screens/checkout/Cart.js) | Also reachable via CheckoutNavigation |
| `notification` | [Notification](src/screens/Notification.js) | NoData placeholder |

## 3. Drawer — `main` Route

[src/navigation/DrawerNavigator.js](src/navigation/DrawerNavigator.js)

- Contains a single screen `MainTabs` → [BottomTabNavigator](src/navigation/BottomTabNavigator.js).
- Header: yellow (`#febf00`), title = [HeaderLogo](src/components/HeaderLogo.js), right actions = [HeaderActions](src/components/HeaderActions.js) with `['search', 'bell', 'wishlist', 'cart']`.
- `CustomDrawerContent` renders a hard-coded `Navigation` array (Login, Search, New Product, My Orders, My Addresses, My Profile, Catalog, and a `Popular` accordion menu).
- Drawer items with `type: 'screen'` call `props.navigation.navigate(item.navigate)`. The `Popular` item uses `type: 'menu'` and renders children via [MAccordion](src/components/MAccordion.js).

## 4. Bottom Tabs — inside Drawer

[src/navigation/BottomTabNavigator.js](src/navigation/BottomTabNavigator.js)

Tabs:
- `Home` → [HomeScreen](src/Tabs/Home/HomeScreen.js)
- `Catalog` → [CatalogScreen](src/Tabs/Catalog/CatalogScreen.js)
- `Profile` → [ProfileScreen](src/Tabs/ProfileScreen.js)
- `More` → [MoreScreen](src/Tabs/MoreScreen.js)
- `Store` → intercepts `tabPress` with `e.preventDefault()` and opens a Tamagui `Sheet` to switch subdomain; selecting an option dispatches `setData({ name: 'currentSubDomain', data: value })`.

The `Store` tab icon is dynamic — image URL flips based on `currentSubDomain` (`stylesphere` vs `fashion`).

## 5. Deep Linking

- Config: [src/navigation/linkingConfig.js](src/navigation/linkingConfig.js)
  - Prefixes: `example://`, `https://example.com`, `http://example.com`.
  - Maps `subdomain/:subdomain` to the `main` screen.
- Runtime parsing: [src/linking/handlers.js](src/linking/handlers.js)
  - Strips `scheme://`, splits path, and if shape is `subdomain/<name>` dispatches `setData({ name: 'currentSubDomain', data: subdomain })`.
  - Installs both a live `Linking` listener and a cold-start `getInitialURL` handler; returns cleanup function consumed by `AppContainer`'s effect.

## 6. Redux Store

[src/store/store.js](src/store/store.js)

- Reducers combined: `page` + `data`.
- `redux-persist` persists only the `data` slice to AsyncStorage (`whitelist: ["data"]`).
- Serializable-check ignores persist actions.

### Slices

- **[dataSlice.js](src/store/dataSlice.js)**
  - `initialState`: `{ currentSubDomain: "stylesphere", subDomains: ["stylesphere", "fashion"] }`
  - Reducer `setData({ name, data })` — generic setter assigning `state[name] = data`.
- **[pageSlice.js](src/store/pageSlice.js)**
  - Keyed by page name: `{ data, loading, error }`.
  - Reducer `setPage({ name, data, loading, error })`.

> Most screens do NOT use Redux. Cart, wishlist, product form state, checkout, and profile screens all rely on local `useState`. Only the store/subdomain switcher and deep-link handler write to Redux today.

## 7. API Layer

- [src/api/apiclient.ts](src/api/apiclient.ts) — `apiRequest({ url, method, data, params, headers })` wrapping axios.
  - `baseURL`: `https://dev301.fathershops-test.xyz/?mp=1`
  - 10s timeout; returns `{ data }` on success or `{ error, status }` on failure.
- [src/api/const.ts](src/api/const.ts) — constants only: `API_DOMAIN = 'https://site.pardeep.app'`, `API_ENDPOINTS = { PRODUCTS, USERS }`.

> No screen currently calls `apiRequest` — the whole app runs off static JSON fixtures in [src/data/](src/data/). Infrastructure is present but not wired.

## 8. Home → Layout Engine

[src/Tabs/Home/HomeScreen.js](src/Tabs/Home/HomeScreen.js) is the layout renderer in production use. Flow:

1. Load static layout JSON from [src/data/home.json](src/data/home.json) and split into `top.rows` and `bottom.rows`.
2. `renderSection(rows)` walks `rows → columns → items`. For each item it reads `item.item.type` and looks it up in [componentMap](src/modules/index.js).
3. Each module is rendered with `data={item.item.data.items || []}` and `options={item.item.data}`.

### `componentMap` — [src/modules/index.js](src/modules/index.js)

| Layout type | Module |
|-------------|--------|
| `master_slider` | [MasterSlider](src/modules/MasterSlider.js) |
| `slider` | [MasterSlider](src/modules/MasterSlider.js) |
| `products` | [Products](src/modules/Products.js) → renders [productGrid](src/modules/productGrid.js) |
| `info_blocks` | [InfoBlocks](src/modules/InfoBlocks.js) |
| `banners` | [banner](src/modules/banner.js) |
| `categories` | [category](src/modules/category.js) |
| `title` | [Title](src/modules/Title.js) |

### Module responsibilities

- **MasterSlider** → normalizes slide data (including nested `items[]` image layers) via `getPlaceholderImage` and delegates to [components/Slider/Slider](src/components/Slider/Slider.js).
- **Products** → iterates over `data` keys, rendering a `ProductGrid` per entry with title + product list.
- **productGrid** → maps raw product objects, renders grid cards (image, label overlays, name, price/special/oldPrice). `onPress` → `navigation.navigate('productView')`. Supports horizontal layout via [MSection](src/components/MSection.js).
- **banner** → responsive background image + title; uses `resolveItemsPerRow` for breakpoints.
- **category** → `rounded` (80x80 + text) or `card` (240x160) styles; press → `navigation.navigate('catalog')`.
- **InfoBlocks** → 2-per-row info grid; only renders when `options.status` is truthy.
- **Title** → wraps [MTitle](src/components/MTitle.js) with optional inline link.
- **slider.js** (legacy) — custom ScrollView carousel. Not referenced by `componentMap`; [MasterSlider](src/modules/MasterSlider.js) uses the Reanimated-based [components/Slider/Slider](src/components/Slider/Slider.js) instead.

## 9. Slider Stack

[src/components/Slider/](src/components/Slider/)

- **Slider.js** — `react-native-reanimated-carousel` wrapper; receives `slideData` + `options`.
- **SlideItem.js** — renders parallax `Animated.Image` with overlay children (text/image/button types). Memoized.
- **render-item.js** — `useCallback`-wrapped factory for the carousel's `renderItem` prop.

## 10. Product Detail — `productView`

[src/screens/ProductView.js](src/screens/ProductView.js)

- Reads static `productData` from [src/data/productView.json](src/data/productView.json).
- Reanimated-carousel image gallery with memoized slides.
- HTML-stripped description, [DescriptionAccordion](src/components/DescriptionAccordion.js) for long content.
- Dynamic product options via [RenderProductOptions](src/components/options.js) (radio/checkbox/select).
- Review list with star ratings.
- Sticky bottom bar: wishlist / Add to cart / Buy now.
- Wishlist is local `useState` — not persisted.
- Header uses [HeaderActions](src/components/HeaderActions.js) for share/wishlist/cart.

## 11. Checkout Flow

[src/screens/checkout/CheckoutNavigation.js](src/screens/checkout/CheckoutNavigation.js) — nested native stack:

1. `cart` → [Cart.js](src/screens/checkout/Cart.js)
   - Hardcoded `cartItems`, quantity/option selectors, promo code, payment method dropdown ([SelectDropdown](src/components/SelectDropdown.js)), address selectors ([Addresses](src/components/Addresses.js)).
   - "Proceed to Checkout" → `navigate('address')`.
2. `address` → [Address.js](src/screens/checkout/Address.js) — stub, button → `payment`.
3. `payment` → [Payment.js](src/screens/checkout/Payment.js) — stub.

No persistence, no API calls, all local state.

## 12. Profile Flow

- Tab route [ProfileScreen.js](src/Tabs/ProfileScreen.js) and drawer stack [Profile.js](src/screens/profile/Profile.js) both render identical menus (My Orders / My Addresses / My Profile).
- [ProfileNavigation.js](src/screens/profile/ProfileNavigation.js) is a separate nested stack (`profile`, `myorders`, `myaddresses`, `myprofile`) — not currently referenced from root stack, which navigates to the screens directly.
- `MyOrders`, `MyAddresses`, `MyProfile` are all placeholder stubs.

## 13. Auth

[src/screens/auth/Login.js](src/screens/auth/Login.js) wraps [Registerform](src/components/Registerform.js) with `formFields` (First/Last Name, Email, Password, Role). Uses `react-final-form`. Submit currently logs + alerts with a 2s delay; no API call, no Redux write.

## 14. Shared UI Components

- **[HeaderLogo](src/components/HeaderLogo.js)** — reads `currentSubDomain` and returns the right logo URL.
- **[HeaderActions](src/components/HeaderActions.js)** — icon toolbar accepting `actions` array: search / share / bell / wishlist / cart. Wishlist icon fills red when `isWishlisted` is true.
- **[HeaderSearch](src/components/HeaderSearch.js)** — search input, no API integration.
- **[Header](src/components/Header.js)** — burger button that toggles drawer.
- **[Addresses](src/components/Addresses.js)** — bottom dialog with a hardcoded address form (Final Form); logs only.
- **[MAccordion](src/components/MAccordion.js) / [DescriptionAccordion](src/components/DescriptionAccordion.js)** — Tamagui accordions.
- **[MBottomDailog](src/components/MBottomDailog.js)** — modal/Sheet hybrid (adaptive).
- **[MSection](src/components/MSection.js)** — titled horizontal/vertical section wrapper.
- **[MTitle](src/components/MTitle.js)** — heading with optional end link.
- **[NoData](src/components/NoData.js)** — empty-state placeholder with icon + text.
- **[RadioButton](src/components/RadioButton.js)** — text or image-based radio.
- **[SelectDropdown](src/components/SelectDropdown.js)** — Tamagui `Select`, syncs to `selectedOption` prop.
- **[options.js](src/components/options.js)** — `RenderProductOptions` for radio/checkbox/select product variants.
- **[Registerform](src/components/Registerform.js)** — Final Form wrapper mapping `formFields` to `Field` components.

## 15. Utilities

- **[getImage.js](src/utils/getImage.js)** — `getPlaceholderImage`. Original-image logic is currently disabled; always returns a `placehold.co` URL. Used across banner / category / productGrid / InfoBlocks / MasterSlider.
- **[getScaledDimensions.js](src/utils/getScaledDimensions.js)** — responsive width/height helper used by `banner`.

## 16. Data Fixtures — [src/data/](src/data/)

- `home.json` — localization/text constants (despite the name).
- `layout1.json`, `product.json`, `productView.json`, `productView2.json` — product data used by Search / ProductView.

## 17. Dead or Unused Code

- [src/navigation/stackNavigator.js](src/navigation/stackNavigator.js) — nested stack not referenced by the root app.
- [src/modules/layoutRenderer.js](src/modules/layoutRenderer.js) — hardcoded demo renderer; HomeScreen uses `componentMap` instead.
- [src/modules/product/card.js](src/modules/product/card.js) and [src/modules/product/index.js](src/modules/product/index.js) — near-empty stubs.
- [src/components/TabBar.js](src/components/TabBar.js) — 1-line stub.
- [src/modules/slider.js](src/modules/slider.js) — legacy custom slider, superseded by `components/Slider/Slider.js`.

## 18. End-to-End Navigation Map

```
App.js (providers)
└── src/App.js (NavigationContainer + deep-link effect)
    └── Stack "main" = DrawerNavigator
        └── Drawer "MainTabs" = BottomTabNavigator
            ├── Home     → HomeScreen (layout engine via componentMap)
            ├── Catalog  → CatalogScreen
            ├── Profile  → ProfileScreen
            ├── More     → MoreScreen
            └── Store    → opens Sheet, dispatches setData(currentSubDomain)
        (Drawer items also navigate into root stack routes: login, search, productView, myorders, myaddresses, myprofile, catalog)
    Other root stack routes:
      catalog, productView, checkoutNavigation (cart→address→payment),
      myorders, myaddresses, myprofile, login, search, wishlist, cart, notification
```

## 19. Known Gaps / Watch-outs

- Duplicate Redux `Provider` wrap (outer + inner).
- `apiclient.ts` is present but unused — all screens consume static JSON.
- `getImage.js` always returns a placeholder; real image URLs are being swallowed.
- Wishlist / cart / auth / orders have no persistence or backend.
- `stackNavigator.js`, `layoutRenderer.js`, `modules/slider.js`, `modules/product/*`, `components/TabBar.js` look like dead code.
- `ProfileNavigation.js` exists but the root stack navigates directly to the leaf profile screens, so the nested stack doesn't run.

## 20. Navigation / Link Audit — Broken or Missing

Every place in the app where a tap *should* lead somewhere but the wiring is missing, wrong, or loses context. Grouped by blast radius.

### 20.1 Critical — tap does nothing or loses identity

- **[productGrid.js:21](src/modules/productGrid.js#L21)** — `navigation.navigate('productView')` passes **no** product id/params. `ProductView` loads a hardcoded `productView.json`, so every product card opens the same static detail page. Fix: pass `{ productId: ProductGrid.id }` and have `ProductView` read `route.params`.
- **[category.js:33-48](src/modules/category.js#L33-L48)** — `CategoryRounded` imports `useNavigation` but **never calls it** and has **no `onPress`**. Since [category.js:64](src/modules/category.js#L64) hardcodes `style = 'rounded'`, tapping a category does absolutely nothing. `CategoryCard` navigates to `'catalog'` but also drops the id.
- **[CatalogScreen.js:8](src/Tabs/Catalog/CatalogScreen.js#L8)** — does not read `route.params`; always renders the one hardcoded product regardless of which category was tapped.
- **[banner.js:14-27](src/modules/banner.js#L14-L27)** — banner `ImageBackground` has no `onPress` / no `TouchableOpacity` wrapper. Banners normally link to a category or promo page; currently inert.
- **[SlideItem.js:83-89](src/components/Slider/SlideItem.js#L83-L89)** — slider `button` child has `onPress={() => console.log('Button pressed')}`. No navigation. `image` and `text` children also have no tap handler even when the CMS data includes a link target.
- **[InfoBlocks.js:20-49](src/modules/InfoBlocks.js#L20-L49)** — no `onPress` on info cards. If these are meant to deep-link to policy/info pages, the link is missing.
- **[HeaderSearch.js](src/components/HeaderSearch.js)** — search input has no `onSubmitEditing` / no navigation. Typing does nothing; no results screen. `SearchScreen` itself also has no live input, just hardcoded popular tags.
- **[Payment.js](src/screens/checkout/Payment.js)** — terminal stub with no "Place Order"/success navigation. Checkout flow dead-ends here.
- **[Login.js](src/screens/auth/Login.js)** — submit logs + alerts; no redirect back, no Redux update, no auth-state gate anywhere in the app.

### 20.2 High — params declared but dropped

- **[DrawerNavigator.js:30, 34](src/navigation/DrawerNavigator.js#L30)** — `Navigation` array items define `parm: '34'` for "New Product" and "Catalog" but the `onPress` at [DrawerNavigator.js:101-105](src/navigation/DrawerNavigator.js#L101-L105) calls `navigate(item.navigate)` without forwarding `parm`. The data is set but never passed.
- **[DrawerNavigator.js:80](src/navigation/DrawerNavigator.js#L80)** — `Popular` submenu items navigate by name only; no params ever reach the target screen.
- **[HeaderActions.js:40-44](src/components/HeaderActions.js#L40-L44)** — `share` falls back to generic strings when `shareData` isn't provided; pages that use `HeaderActions` (e.g. ProductView header) don't pass `shareData`, so shares leak no product link.

### 20.3 Medium — flow inconsistencies

- **[linkingConfig.js:3](src/navigation/linkingConfig.js#L3) vs [handlers.js](src/linking/handlers.js)** — `linking.prefixes` is `['example://', 'https://example.com', 'http://example.com']`, but `handlers.js` parses `ocjournal://subdomain/...`. React Navigation's `linking` won't match the real scheme; only the manual `Linking` listener works. Either add `ocjournal://` to prefixes or align schemes.
- **Two routes for the cart**: root stack `cart` → `Cart`, plus `checkoutNavigation/cart` → same `Cart`. [Cart.js:359](src/screens/checkout/Cart.js#L359) proceeds via `navigate('checkoutNavigation', { screen: 'address' })`, which works but means entering checkout from the root `cart` route pops you over into a different stack. Unify or pick one entry.
- **ProductView wishlist** uses local `useState`; `HeaderActions` wishlist action navigates to the Wishlist screen, which shows only `NoData`. Toggling the heart on the product page has no visible effect elsewhere.
- **[Address.js:11](src/screens/checkout/Address.js#L11)** — stub with a single "Pay Now" button. No address form, no validation, no selection of an existing address. Hands off an empty state to Payment.
- **[ProfileScreen.js:55](src/Tabs/ProfileScreen.js#L55)** — stray debug `Button title="Go to Details" onPress={navigate('login')}` still present below the legitimate menu.
- **Tabs vs root Catalog**: Bottom tab `Catalog` and root-stack `catalog` both mount `CatalogScreen`. Same screen, different navigator instance, different back behaviour.

### 20.4 Low — missing UX links

- **MoreScreen, MyOrders, MyAddresses, MyProfile** are pure stubs — no links at all (e.g. "Add address", "View order details"). If [Addresses.js](src/components/Addresses.js) is meant to be reachable standalone, it currently isn't.
- **Wishlist / Notification** render only `NoData`; no "Continue shopping" CTA back to Home.
- **[Title.js](src/modules/Title.js)** passes `inline_button_link?.href` straight into `<Link to=...>`. If the CMS returns an external URL (likely, e.g. `https://...`), React Navigation can't resolve it and the link is a no-op.
- **[ProfileNavigation.js](src/screens/profile/ProfileNavigation.js)** — defined but unreferenced. Root stack navigates directly to the leaf profile screens instead of through this nested stack.

### 20.5 Quick patch checklist

1. `productGrid` → pass `{ productId }`; `ProductView` → read `route.params.productId`, fall back to static data.
2. `CategoryRounded` → add `onPress={() => navigation.navigate('catalog', { categoryId: category.id })}`.
3. `CatalogScreen` → consume `route.params.categoryId`, filter products (or fetch via `apiRequest`).
4. `banner.js Banners` → wrap `ImageBackground` in `TouchableOpacity` navigating to `bannerData.link` target.
5. `SlideItem` button → accept an `onPress` / `link` prop from slide data and navigate.
6. `HeaderSearch` → add `onSubmitEditing` that navigates to `search` with the query.
7. `Payment` → add "Place Order" → navigate back to `main` (Home) + clear cart.
8. `Login` submit → navigate back (or to `main`) on success.
9. `DrawerNavigator` → forward `item.parm` as `{ id: item.parm }` in `navigate`.
10. `linkingConfig` → add the real `ocjournal://` prefix.
11. Remove stray debug button in `ProfileScreen`.

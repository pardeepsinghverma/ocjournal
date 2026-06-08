# Module: `products`

> **Status:** ✅ Rendered by the app
> **Layout type string:** `products`  ·  **App component:** `Products` (src/modules/Products.js)

## 1. What it is

The `products` module renders a grid or carousel of product cards displaying images, names, prices, and promotional labels. It's typically used for home page sections like "New Arrivals" where customers can browse and navigate to product detail pages.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Instance ID | Instance Name |
|----------|-----|-----|------|-------------|---------------|
| top | 4 | 1 | 2 | 867 | Products / Home / New Arrivals from Category |

## 3. API `item.data` shape

The `products` module receives rich configuration data to control display and behavior. Key fields:

| Field | Type | Purpose |
|-------|------|---------|
| **items** | object | The root data object containing product collections, keyed by category or section. Each key maps to an object with `title` and `products`. |
| **title** | string | Section title displayed above the product grid. |
| **products** | object | Product data keyed by product ID, each containing `product_id`, `name`, `thumb` (image), `price`, `tax` (old price), `special` (sale text), and `labels` (badges). |
| **carousel** | boolean | Whether to enable carousel mode (default: `true`). |
| **carouselStyle** | string | Style variant for carousel (e.g., "SLIDER"). |
| **itemsPerRow** | object | Responsive column counts for different breakpoints (c0, c1, c2, sc). |
| **moduleProductList** | string | Display mode ("SLIDER" or "GRID"). |
| **moduleProductListSecondImageStatus** | boolean | Whether to show alternate product image on hover. |
| **moduleProductListCartDisplay** | string | Cart button visibility ("both", "icon", "text", etc.). |
| **moduleProductListWishlistDisplay** | string | Wishlist icon visibility ("icon" or hidden). |
| **moduleProductListRatingVisibility** | boolean | Whether to show product ratings. |
| **limit** | string | Maximum number of products to display. |
| **imageDimensions** | object | Image `width`, `height`, `resize` mode ("fill"). |

## 4. How the app renders it

**Component registration:** `src/modules/index.js:15` defines `products: Products` in `componentMap`.

**Entry point:** `src/modules/Products.js` (lines 1–15)
- Receives `data` prop from `HomeScreen`
- Iterates over `Object.keys(data)` to extract each product collection
- For each collection, passes `products={item.products}` and `title={item.title}` to `ProductGrid`

**Rendering:** `src/modules/productGrid.js` (lines 131–152)
- `ProductGrid` component maps products using `mapProducts()` helper (lines 114–129)
- Wraps output in `MSection` with optional horizontal scroll
- Maps each product to a `ProductGridCard`

**Card rendering:** `src/modules/productGrid.js` (lines 12–112)
- `ProductGridCard` component displays:
  - Product image via `getPlaceholderImage()` (line 50, src/utils/getImage.js)
  - Product name (line 68)
  - Current price (line 81)
  - Old/strikethrough price if present (line 92, field `tax`)
  - Special/sale text if present (line 101, field `special`)
  - Labels/badges (lines 30–46, from `ProductGrid.labels`)
- Tap navigates to product detail: `navigation.navigate('productView', { productId: ProductGrid.id })` (line 21)

**Data mapping flow:**
```
item.data.items[key].products (API object)
  → mapProducts() extracts: product_id → id, name, thumb → image, price, tax → oldPrice, special, labels
  → ProductGridCard renders name, price, oldPrice, special, labels, and image
```

**Image handling:** `getPlaceholderImage()` returns a placeholder URL if the image is missing, falsy, or invalid (src/utils/getImage.js:10–28). Width/height are derived from responsive card dimensions.

## 5. Gotchas & notes

- **Prices are pre-formatted strings:** `price` and `tax` fields are already formatted (e.g., "$99.99"); the component does not apply currency formatting.
- **Old price field is named `tax` in the API:** The `mapProducts()` function maps `product.tax` → `oldPrice` (line 125), so the UI reads the old price from the API's `tax` field, not a dedicated `oldPrice` field.
- **Placeholder images:** If a product's `thumb` URL is missing or invalid, `getPlaceholderImage()` serves a placeholder from `placehold.co` instead of failing silently.
- **Labels are optional:** The `labels` field defaults to an empty object (line 127) if not present, so cards without badges render without error.
- **Carousel mode hard-coded:** The component does not yet respect the `carousel`, `carouselStyle`, or `itemsPerRow` configuration from `item.data`; it always renders a horizontal scroll on small screens and a grid on larger screens based on `ScrollDirection` prop.
- **Product grid is split by section:** The `Products` component iterates over `data` keys, so if the API returns multiple product collections (e.g., `{ "section1": {...}, "section2": {...} }`), each renders as its own `ProductGrid` with its own title and scroll/grid mode.
- **No quickview, wishlist, or compare buttons yet:** Despite extensive configuration fields in the API (`moduleProductListQuickviewDisplay`, `moduleProductListWishlistDisplay`, `moduleProductListCompareDisplay`), these interactive features are not yet implemented in the React Native component.

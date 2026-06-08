# Module: `banners`

> **Status:** ✅ Rendered by the app
> **Layout type string:** `banners`  ·  **App component:** `Banner` (src/modules/banner.js)

## 1. What it is

The `banners` module renders a grid of clickable image-based banners with overlaid text. Each banner is a responsive card that displays a product or category promotion, with support for multi-line text overlays and navigation to product views or category pages. Banners automatically scale based on device width and responsive breakpoints defined in the layout API.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Instance ID | Instance Name |
|----------|-----|-----|------|-------------|---------------|
| top | 2 | 1 | 1 | 798 | Simple Banners / Bento 9 / Left |
| top | 2 | 2 | 1 | 797 | Simple Banners / Bento 9 / Right |

## 3. API `item.data` shape

| Field | Type | Purpose |
|-------|------|---------|
| `items` | object (keyed by index) | Core content: each item is a banner with image, text overlays, and link metadata |
| `itemsPerRow` | object | Responsive breakpoint config (c0, c1, c2, sc keys) defining items per row and spacing at each breakpoint |
| `imageDimensions` | object | Base image dimensions: `{ width: 435, height: 590, resize: "fill" }` |
| `bannerStyle` | string | Style identifier (e.g., "BANNERS") |
| `carousel` | boolean | Carousel mode toggle (false by default) |
| `carouselOptions` | object | Carousel settings (speed, autoplay, pauseOnHover, loop) if carousel mode enabled |
| `title` | string | Optional module-level title |
| `lazyLoad` | boolean | Lazy loading enabled |
| `gridType` | string | Grid layout type (e.g., "auto") |
| `width` | number | Container width (435) |
| `height` | number | Container height (590) |

**Per-item fields** (each banner in `items`):
| Field | Type | Purpose |
|-------|------|---------|
| `image` | string | Primary image URL |
| `image2x` | string | Retina/2x resolution image URL |
| `image_width` | number | Original image width |
| `image_height` | number | Original image height |
| `title` | string | First line of text overlay |
| `title2` | string | Second line of text overlay |
| `title3` | string | Third line of text overlay |
| `alt` | string | Image alt text |
| `link` | object | Navigation target: `{ product_id: string }` or `{ category_id: string }` |
| `color_scheme` | string | Color scheme identifier |
| `id` | string | Unique banner identifier |
| `classes` | object | CSS class metadata |

## 4. How the app renders it

**Component:** `Banner` exported from `/src/modules/banner.js` (line 88–115)

**Registration:** `componentMap.banners = Banner` in `/src/modules/index.js` (line 17)

**Prop contract:** `HomeScreen` passes `data={item.item.data.items}` (the banners array keyed by index) and `options={item.item.data}` (full module config)

**Field-to-prop mapping:**
- Data shape in `options.itemsPerRow` → responsive grid calculation via `resolveItemsPerRow(options.itemsPerRow, windowWidth)` (banner.js lines 42–86)
- Data shape in `options.imageDimensions` → passed to child `Banners` component for scaling
- Each banner item (`bannerData`) → passed to `Banners` component (lines 104–111)

**Rendering flow:**
1. Banner component receives `data` (items keyed by index) and `options` (module config)
2. Calls `resolveItemsPerRow` to resolve responsive breakpoint-based items-per-row count and spacing
3. Maps over `Object.keys(data)` and renders a `Banners` child component for each item (lines 101–112)
4. Banners component (lines 7–40):
   - Calls `getScaledDimensions` with original dimensions, per-row count, and spacing to calculate responsive width/height (lines 9–14)
   - Wraps content in `TouchableOpacity` with calculated dimensions (line 28)
   - Renders `ImageBackground` with `getPlaceholderImage(bannerData.image, width, height, 'Banner')` as source (line 30)
   - Overlays three text lines: `title`, `title2`, `title3` (lines 34–36)
   - On press, calls `handlePress` (lines 16–25): navigates to 'productView' if `link.product_id`, 'catalog' if `link.category_id`, else defaults to 'catalog'

**Styling:**
- Wrapper: flex row with wrap, rowGap/columnGap from spacing, 10px vertical margin (lines 93–100)
- ImageBackground: borderRadius 8px, text positioned bottom-left (lines 119–121)
- Text overlay: white, 16px font, bold, text shadow for contrast, 10px horizontal padding (lines 122–131)

## 5. Gotchas & notes

- **Responsive scaling:** `getScaledDimensions` (imported from utils, src/modules/banner.js line 4) maintains aspect ratio and accounts for device width, items per row, and gap spacing. Calculations subtract 28px from device width (16px padding × 2 sides) before dividing by items per row.
- **Breakpoint resolution:** The `itemsPerRow` config uses keys `c0`, `c1`, `c2`, `sc` representing different device classes. The `resolveItemsPerRow` function looks for numeric breakpoint keys within `c0` (e.g., `760`, `1080`) sorted ascending, finding the smallest breakpoint >= current window width.
- **Image fallback:** `getPlaceholderImage` (imported from utils, src/modules/banner.js line 5) returns a placeholder URL from `placehold.co` if the image URL is missing or invalid. The placeholder includes width, height, and custom text ("Banner").
- **Navigation:** Banners without `link.product_id` or `link.category_id` default to catalog navigation (line 23). Navigation requires React Navigation setup in the parent screen.
- **Text overlays:** All three title fields are rendered unconditionally; empty strings will render as blank lines. Text is positioned bottom-left with a dark shadow for legibility on background images.
- **Object iteration:** Banner data is iterated via `Object.keys(data)` (line 101), so data must be an object keyed by numeric or string indexes, not an array.

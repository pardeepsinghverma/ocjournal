# Module: `slider`

> **Status:** ✅ Rendered by the app
> **Layout type string:** `slider`  ·  **App component:** `MasterSlider`

## 1. What it is

The `slider` module renders a horizontally scrollable carousel of images with optional parallax effects, overlaid text/buttons, and navigation links. It's a primary hero/showcase component for displaying featured products, promotions, or category highlights in the home layout, powered by `react-native-reanimated-carousel` for smooth pan-gesture animations and parallax depth effects.

## 2. Where it appears in the live home layout

| Position | Row | Column | Item | Instance ID | Instance Name |
|----------|-----|--------|------|-------------|---------------|
| top | 1 | 1 | 1 | 871 | Slider / Default / Image Layer / Hotspots |

## 3. API `item.data` shape

The slider receives extensive configuration options in `item.data`. The key fields are:

| Field | Type | Purpose |
|-------|------|---------|
| `items` | Object of slides | **Required.** Contains the carousel slides; each slide can have `id`, `image`, and nested `items` array (for overlays like text, buttons, images). |
| `height` | Number | Carousel height in pixels (default from options: 200). |
| `loop` | Boolean | Whether carousel loops infinitely when swiping past the last slide. |
| `autoPlay` | Boolean | Whether carousel auto-advances between slides. |
| `autoPlayInterval` | Number | Interval in ms between auto-play advances (hardcoded to 2000 in Slider.js). |
| `color_scheme` | String | Theme/color variant name. |
| `parallax` | Boolean | Enable parallax scrolling effect (visual depth). |
| `parallaxValue` | String | Parallax offset amount (e.g., `"-10%"`). |
| `thumbnails` | Boolean | Show thumbnail strip below carousel. |
| `pagination` | String | Pagination indicator style (`"bullets"`, etc.). |
| `buttonsStatus` | Boolean | Show prev/next navigation buttons. |
| `staticText` / `static2Text` | String | Optional overlay text on all slides. |
| `lazyLoad` | Boolean | Lazy-load images (not implemented in current render). |
| `shuffle` | Boolean | Randomize slide order. |
| `schedule` | Object | Visibility schedule (`{from, to, between}`). |

**Content location:** Real slide content lives in `items` object (not array—values are iterated). Each slide item may have:
- `image` (direct URL), OR
- `items` object containing an `image` type child with `image` field

**Overlay content:** Child items in `slide.items` (text, image, button types) render as overlays on the slide image.

## 4. How the app renders it

### componentMap entry (src/modules/index.js, line 14)
```javascript
slider: MasterSlider,
```

### Data transformation pipeline

**MasterSlider** (`src/modules/MasterSlider.js`, lines 7–54) receives `{ data, options }`:
1. Calls `mapSlides(data)` to transform raw layout data into carousel-ready format
2. Searches each slide's `items` for nested `image` type child if no direct `image` exists (lines 17–22)
3. Passes transformed slides to `Slider` component as `slideData` prop, and module options as `options` prop (lines 47–50)

```javascript
// Line 48–49:
<Slider
    slideData={mapSlides(data)}
    options={options.options}
/>
```

**Field-to-prop mapping in MasterSlider (lines 14–33):**
- `slide.id` → `id` (fallback to `Math.random()`)
- `slide.image` or child image → `image`, wrapped with `getPlaceholderImage(image, 800, 400, 'Slider')` (line 26)
- `slide.items` children → `children` array with shape `{ type, text, data }` (lines 27–31)

### Carousel rendering in Slider component

**File:** `src/components/Slider/Slider.js` (lines 7–49)

Props consumed:
- `slideData`: array of `{ id, image, children }` objects
- `options`: config object with `loop`, `height`, `autoPlay`

Carousel configuration:
```javascript
// Lines 16–45:
<Carousel
  loop={options.loop || false}
  width={width - 28}
  height={options.height || 200}
  mode="parallax"
  modeConfig={{
    parallaxScrollingScale: 1,
    parallaxScrollingOffset: 10,
    parallaxAdjacentItemScale: 1,
    parallaxAdjacentItemOpacity: 1,
  }}
  itemWidth={width - 40 * 2}
  autoPlayInterval={2000}
  autoPlay={options.autoPlay || false}
  data={slideData}
  renderItem={renderItem({ rounded: true, style: { marginRight: 8 }, currentIndex })}
/>
```

### Slide item rendering in SlideItem component

**File:** `src/components/Slider/SlideItem.js` (lines 26–82)

Each slide renders:
1. **Image layer** (`Animated.Image`, lines 55–64): source from `slideData.image`, borders rounded to `borderRadius: 15`, resize mode `"cover"`
2. **Clickable wrapper** (`TouchableOpacity`, line 54): calls `handleSlidePress` → `navigateFromLink(navigation, slideData?.link)`
3. **Overlay (optional, lines 66–79):** if `slideData.children` exist, renders positioned `View` with `ChildItem` components

### Navigation from slides (SlideItem.js, lines 7–24)

The `navigateFromLink` function:
- **Product link:** `navigation.navigate('productView', { productId: ... })`
- **Category link:** `navigation.navigate('catalog', { categoryId: ... })`
- **URL link:** resolved but not navigated (navigation.navigate not called)

Link resolution order (line 7–14):
1. String → `{ type: 'url', url: link }`
2. `link.product_id` → product navigation
3. `link.category_id` → category navigation
4. `link.href` → URL type

### Child overlay items (SlideItem.js, lines 84–118)

Children render inside the overlay based on type:
- **`type: 'text'`** (line 92–94): `<Text>` with `styles.overlayText` (white, bold, 14px)
- **`type: 'image'`** (line 95–108): `Animated.Image` 30×30px, borderRadius 15
- **`type: 'button'`** (line 110–115): `<Button>` with link navigation via `navigateFromLink`

### Image handling

**getPlaceholderImage** (`src/utils/getImage.js`, lines 10–28):
- If image is null/undefined/"null"/"undefined", returns placeholder URL: `https://placehold.co/{width}x{height}/EEE/c3c3c3.png`
- MasterSlider calls with dimensions `800 × 400` and text `"Slider"` (line 26)
- All slides fallback to a gray placeholder if no valid image provided

## 5. Gotchas & notes

- **Placeholder fallback:** All missing/invalid images render a gray placeholder image. The layout API doesn't enforce image presence, so slides will appear with placeholders if `image` is null or nested child image is missing.

- **Nested image discovery:** If a slide has no direct `image` field, the component searches `slide.items` for a child with `type: 'image'` and uses its `image` field. This allows flexible slide composition (image as a layer).

- **Overlay positioning:** The overlay (`styles.overlay`) is absolutely positioned with `top: 0, left: 10, right: 0, bottom: 30`, meaning it covers most of the slide except a 30px bottom margin. Text/buttons render at baseline alignment, which may appear low on the slide.

- **Parallax always enabled:** The Slider uses `mode="parallax"` hardcoded (line 20); the module's `parallax` config option in dataShape is not currently passed to the Carousel component. The `parallaxValue` and parallax offset fields are defined but unused.

- **Auto-play interval fixed:** `autoPlayInterval={2000}` is hardcoded (line 31); the module's config options for parallax duration/timing are not consumed.

- **URL links dropped:** Links with `type: 'url'` are resolved but not navigated—only product and category links trigger navigation (line 19–24).

- **Carousel dimensions:** Width is dynamically calculated as `Dimensions.get('window').width - 28` (line 8), and `itemWidth` is `width - 80` (line 27), creating fixed side spacing.

- **Current slide tracking:** The `currentIndex` shared value is tracked (line 9) and passed to renderItem, but child animations based on `currentIndex` are partially disabled (SlideItem line 42 has opacity set to 1, not reactive).

- **Swipe behavior:** Pan gesture activeOffset is `[-10, 10]` (line 35–36), allowing 10px threshold before swipe triggers. `quickSnap` is enabled.

- **Thumbnails/pagination config:** The module dataShape includes `thumbnails`, `pagination`, `bulletsType` options but these are not implemented in the current Slider/SlideItem rendering.


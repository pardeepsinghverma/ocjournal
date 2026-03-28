# Detailed Analysis: Banner Module (`banners`)

The Banner module is a versatile component used to display promotional imagery. It can function as a single static image, a grid of multiple images, or a touch-enabled carousel.

---

## 1. JSON Configuration Breakdown (`layout1.json`)

The module is defined by `"module_type": "banners"`. Its behavior is governed by the `options` object.

### A. Global Module Options
| Parameter | Type | Description |
| :--- | :--- | :--- |
| `status` | `boolean` | Master toggle for the module's visibility. |
| `carousel` | `boolean` | If `true`, the UI should render a horizontal slider/carousel. |
| `carouselOptions` | `object` | Settings for the slider: `speed` (ms), `autoplay` (bool), `loop` (bool), `pauseOnHover` (bool). |
| `itemsPerRow` | `object` | **Responsive Grid Definition**. Contains breakpoints (e.g., `c0`, `c1`, `c2`, `sc`). Each breakpoint can be a simple array or an object with specific sub-breakpoints (e.g., `"0": { "items": 5, "spacing": 30 }`). |
| `imageDimensions` | `object` | The base aspect ratio: `width`, `height`, and `resize` (usually `"fill"`). |
| `lazyLoad` | `boolean` | Visibility optimization flag. |
| `classes` | `object` | stylistic identifiers (e.g., `"carousel-mode": true`, `"module-banners-382"`). |

### B. Individual Item Properties (`items` object)
Each key in the `items` object (e.g., `"1"`, `"2"`) represents one banner:
- **Visuals**:
    - `image`: URL of the primary image.
    - `image2x`: High-resolution alternative URL.
    - `alt`: Alternate text for individual banners.
- **Content Overlay**:
    - `title`: Primary heading (rendered as top line).
    - `title2`: Secondary heading (rendered as middle line).
    - `title3`: Tertiary heading/description (rendered as bottom line).
- **Navigation (`link` object)**:
    - `type`: Target type (`"page"`, `"product"`, `"category"`, or empty).
    - `href`: The destination URL.
    - `id`: Numeric ID for internal resource mapping.
- **Styling**:
    - `classes`: Metadata such as `"swiper-slide": true` (used if `carousel` is active).

---

## 2. Component Logic (`banner.js`)

The React Native implementation translates the abstract JSON into a mobile interface.

### Rendering Architecture
1. **The Wrapper (`Banner` Component)**:
   - Receives all `data` (the items) and `options`.
   - Uses a `View` with `flexDirection: 'row'` and `flexWrap: 'wrap'`.
   - **Limitation**: Currently, it renders all items in a wrapping flex container even if `carousel: true` is set in the JSON.

2. **The Item (`Banners` Component)**:
   - Calculate sizes using `getScaledDimensions`.
   - **Internal Logic**: `ImageBackground` is the core container. It ensures text is overlayed on top of the image.
   - **Default Stylings**: Hardcoded center alignment (`alignItems: 'center'`, `justifyContent: 'center'`) and white bold text with a text shadow for contrast against various image backgrounds.

### Scaling Logic (`getScaledDimensions.js`)
- **Padding Handling**: Subtracts `28` from the device width (implied `14` padding on both sides).
- **Gap Calculation**: `effectiveSpacing` is calculated as `spacing * (perRow - 1)`.
- **Current Observation**: The `Banner` component calls this utility with only two arguments:
  ```javascript
  getScaledDimensions(imageDimensions.width, imageDimensions.height)
  ```
  This causes `perRow` to default to `1`, meaning even if the JSON specifies 2 or 3 items per row, the app currently defaults to full-width banners minus standard margins.

---

## 3. Functional Status & Missing Implementations

### ✅ Fully Functional:
- [x] Basic image rendering from remote URLs.
- [x] Correct aspect ratio maintenance via scaling utility.
- [x] Triple-layered text overlay with high-contrast shadows.
- [x] Responsive layout wrapping (via `flexWrap`).

### ⚠️ Partially Functional / Needs Verification:
- [ ] **Breakpoint Switching**: The `itemsPerRow` object from JSON is received but not yet dynamically passed to the scaling utility based on device width.
- [ ] **Spacing**: Spacing from JSON is ignored in favor of a fixed 5px margin in `banner.js`.

### ❌ Not Currently Implemented:
1. **Interaction**: There is no `TouchableOpacity` or `onPress` logic. Clicking a banner currently does nothing.
2. **Carousel Mode**: No horizontal slider component is used when `carousel: true`.
3. **Scheduling**: The `from`/`to` dates in the `schedule` object are not evaluated; the module is always "on" if `status` is true.
4. **Lazy Loading**: Images load normally regardless of the `lazyLoad` flag.

---

## 4. Recommendations for Implementation
To fully utilize the JSON's potential, the following changes are recommended:
1. Wrap `Banners` in a `TouchableOpacity` and use the `link` object for navigation.
2. Update `Banner` to check `options.carousel` and wrap items in a `ScrollView` or `FlatList` with horizontal paging.
3. Pass the correct `perRow` and `spacing` from `options.itemsPerRow` into `calculateScaledDimensions`.

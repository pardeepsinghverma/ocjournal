# Module: `manufacturers`

> **Status:** ✅ Rendered by the app — wired in `src/modules/Manufacturers.js`, registered in `componentMap`
> **Layout type string:** `manufacturers` · **App component:** — (none)

## 1. What it is

The manufacturers module displays a grid or carousel of brand/manufacturer logos and information in the home layout. It typically renders as tabbed sections where each tab contains a set of manufacturers with their images and details, allowing users to browse and filter products by brand.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Instance ID | Instance Name |
|----------|-----|-----|------|-------------|---------------|
| bottom   | 1   | 1   | 2    | 997         | Brands / Default |

The "Brands / Default" instance is configured but not rendered by the app.

## 3. API `item.data` shape

The manufacturers module receives the following key fields in its `item.data` object:

| Field | Type | Purpose |
|-------|------|---------|
| `title` | string | Section heading for the manufacturers display |
| `titleStyle` | string | CSS class/style for the title (e.g., "DEFAULT") |
| `items` | object | Main content: keyed tabs, each containing manufacturer data and an `items` array |
| `carousel` | boolean | Whether to display in carousel mode (true/false) |
| `carouselStyle` | string | Carousel styling mode (e.g., "DEFAULT", "BUTTONS_TOP") |
| `gridType` | string | Layout type: "auto", "grid", etc. |
| `autoGridStyle` | string | Grid size preset (e.g., "SMALL") |
| `itemsPerRow` | object | Responsive breakpoints (c0, c1, c2, sc) defining items per row at each screen size |
| `imageDimensions` | object | Image sizing: `{ width: 160, height: 160, resize: "fit" }` |
| `image_width` / `image_height` | number | Fallback image dimensions (160×160) |
| `color_scheme_content` | string | Color scheme selector for manufacturer content |
| `viewMoreText` | string | Text for "view more" button/link |
| `carouselOptions` | object | Carousel behavior: `{ speed, autoplay, pauseOnHover, loop }` |

**Content structure in `items`:**
Each tab in `items` (keyed by index) contains:
- `title` (string): tab name
- `tabType` (string): type identifier for the tab
- `manufacturers` (object): keyed manufacturer objects
- `items` (array): manufacturer item collection (items within the tab)

Each manufacturer item typically has:
- `title`: brand/manufacturer name
- `image`: logo or brand image URL
- `id`: unique identifier

## 4. How the app renders it

**Current status:** The `manufacturers` type is **not mapped** in the `componentMap` (src/modules/index.js:12–20). This means:

```javascript
// src/modules/index.js
const componentMap = {
    master_slider: MasterSlider,
    slider: MasterSlider,
    products: Products,
    info_blocks: InfoBlocks,
    banners: Banner,
    categories: Category, 
    title: Title,
    // ❌ NO manufacturers entry
};
```

When `HomeScreen.renderSection` encounters a module of type `manufacturers`, it finds no entry in `componentMap` and renders nothing—the section is silently dropped.

### How to add it

**Recipe for implementing the manufacturers module:**

1. **Create the component file:** `src/modules/Manufacturers.js`
   ```javascript
   import React from 'react';
   import { View, useWindowDimensions } from 'react-native';
   import MSection from '../components/MSection';
   import ManufacturerCard from './path/to/manufacturer-card'; // Create this sub-component
   import { getPlaceholderImage } from '../utils/getImage';
   import getScaledDimensions from '../utils/getScaledDimensions';

   const Manufacturers = ({ data, options }) => {
     const { width: windowWidth } = useWindowDimensions();
     
     // Parse responsive itemsPerRow config (see banner.js for pattern)
     // Iterate over data.items (tabs)
     // For each tab, render the manufacturers array with ManufacturerCard
     
     return (
       <MSection title={options.title} titleLevel={'4'}>
         {/* Render tabs + manufacturer grid/carousel here */}
       </MSection>
     );
   };

   export default Manufacturers;
   ```

2. **Create a ManufacturerCard sub-component** (similar to CategoryCard in category.js):
   - Accept a manufacturer object with `{ title, image, id, ... }`
   - Use `getPlaceholderImage(manufacturer.image, width, height, 'Manufacturer')` for image handling
   - Render image + title in a card/tile
   - Handle navigation (if manufacturer has a link, navigate to catalog or product view)

3. **Register in componentMap** (src/modules/index.js):
   ```javascript
   import Manufacturers from './Manufacturers';

   const componentMap = {
       // ... existing entries ...
       manufacturers: Manufacturers,
   };
   ```

4. **Follow conventions from existing modules:**
   - Use `MSection` wrapper (see Category.js and banner.js)
   - Use `getPlaceholderImage()` for image URLs (see banner.js:30, category.js:26)
   - Parse `itemsPerRow` with responsive breakpoints (see banner.js:42–86 for the helper)
   - Use `useWindowDimensions()` to get screen width for responsive sizing
   - Handle tabs by iterating `options.items` and rendering each tab's manufacturers

## 5. Gotchas & notes

- **Tabbed structure:** Unlike `categories` or `banners`, the manufacturers data is wrapped in tabs (the `items` object contains tab definitions, each with its own `manufacturers` and `items` array). You'll need to render tab headers and panels or a tab switcher.

- **Placeholder images:** Use `getPlaceholderImage(url, width, height, 'Manufacturer')` to handle missing/invalid image URLs gracefully (see category.js:26, banner.js:30).

- **Responsive itemsPerRow:** The `itemsPerRow` field uses breakpoint-based configuration (c0, c1, c2, sc). See banner.js:42–86 for the exact parsing logic to support multiple screen sizes.

- **Image dimensions:** The API provides both `imageDimensions` (object with width/height/resize) and fallback `image_width`/`image_height` fields. Prefer the object form.

- **Carousel mode:** When `options.carousel` is true, consider rendering a carousel/swiper component instead of a grid. Use `carouselOptions` for speed/autoplay/loop settings (similar to MasterSlider setup).

- **Color scheme:** The `color_scheme_content` field is available but not currently used by other modules—confirm with design whether this should affect text/background colors.

- **Navigation:** If manufacturer items have a `link` field (similar to banners), implement navigation to catalog or product view. If no `link`, items may be display-only.

- **Dummy image:** The API provides a `dummy_image` base64 PNG as a fallback placeholder—`getPlaceholderImage()` likely handles this internally.

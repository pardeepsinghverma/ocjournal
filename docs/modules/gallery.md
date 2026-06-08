# Module: `gallery`

> **Status:** ✅ Rendered by the app — wired in `src/modules/Gallery.js`, registered in `componentMap`
> **Layout type string:** `gallery`  ·  **App component:** — (none)

## 1. What it is

A gallery/lightbox module that displays a grid of thumbnail images with the ability to open them in a full-screen modal view. Supports configurable grid layouts, thumbnail dimensions, image carousels, and lightbox display modes. Can source images from local assets or external APIs (e.g., Instagram), with options for download, actual size viewing, and full-screen modal interaction.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Instance ID | Instance Name |
|----------|-----|-----|------|-------------|---------------|
| bottom   | 4   | 1   | 2    | 838         | Gallery / Simple Carousel |

## 3. API `item.data` shape

| Field | Type | Purpose |
|-------|------|---------|
| **images** | Array of objects | Primary content: array of image objects (18 total in data), each with `src`, `srcset`, `width`, `height`, `thumb`, `subHtml` properties |
| **title** | string | Optional heading text for the gallery section |
| **source** | string | Image source location (`"local"` or external API like Instagram) |
| **galleryModuleStyle** | string | Visual style preset (`"DEFAULT"` or other variant) |
| **thumbsLimit** | string | Maximum number of thumbnails to display (`"16"` in this instance) |
| **thumbDimensions** | object | Thumbnail sizing: `width` (160px), `height` (160px), `resize` ("fill") |
| **moduleGallery** | string | Lightbox/modal mode (`"DEFAULT"`) |
| **moduleGalleryMode** | string | Lightbox animation/transition style (`"lg-fade"`) |
| **moduleGalleryDownload** | boolean | Show/hide download button in lightbox |
| **moduleGalleryActualSizeVisibility** | boolean | Show/hide "actual size" toggle |
| **moduleGalleryFullScreen** | boolean | Enable full-screen lightbox mode |
| **moduleGalleryThumbToggleStatus** | boolean | Show/hide thumbnail toggle in lightbox |
| **popupImageDimensions** | object | Lightbox image sizing: `width` (2000px), `height` (null), `resize` ("fill") |
| **popupThumbDimensions** | object | Lightbox thumbnail sizing: `width` (90px), `height` (90px) |
| **carousel** | boolean | Enable carousel/swiper mode for main images (`false` in this instance) |
| **carouselOptions** | object | Carousel settings: `speed`, `autoplay`, `pauseOnHover`, `loop` |
| **itemsPerRow** | object | Responsive grid columns per breakpoint (`c0`, `c1`, `c2`, `sc` variants) |
| **gridType** | string | Grid layout algorithm (`"auto"` or fixed grid) |
| **autoGridStyle** | string | Auto-grid preset size (`"SMALL"`, `"MEDIUM"`, `"LARGE"`) |
| **button** | boolean | Show/hide CTA button at gallery bottom |
| **buttonText** | string | CTA button label text (`"Open Gallery"`) |
| **color_scheme** | string | Optional color theme identifier |
| **schedule** | object | Content visibility scheduling: `from`, `to`, `between` (boolean) |
| **dynamic** | boolean | Load images dynamically from API (`true` in this instance) |
| **dynamicPath** | string | API path for dynamic image loading (`"journal3/assets/demos/9/v1/Gallery/"`) |
| **instagramPage** | string | Instagram handle if `source: "instagram"` |
| **productImages** | boolean | Whether these are product variant images |
| **options** | object | Lightbox options: `addClass` (CSS class), `colorSchemeClass`, `thumbWidth`, `thumbHeight`, `allowMediaOverlap` |
| **classes** | object | CSS classes: `"module"`, `"module-gallery"`, `"module-gallery-{id}"`, carousel/align flags |
| **status** | boolean | Module visibility toggle |
| **name** | string | Instance label in admin UI |
| **module_id** | number | Unique identifier (838 in this instance) |

**Content key:** Real gallery content lives in the `images` array. Each image object requires `src` (primary image URL) and `thumb` (thumbnail URL); `srcset` enables responsive image selection.

## 4. How the app renders it

**Currently: NOT RENDERED.** The `componentMap` in `src/modules/index.js` (line 12–20) has no entry for `"gallery"`:

```javascript
const componentMap = {
    master_slider: MasterSlider,
    slider: MasterSlider,
    products: Products,
    info_blocks: InfoBlocks,
    banners: Banner,
    categories: Category, 
    title: Title,
    // ← NO "gallery" entry
};
```

When `HomeScreen.renderSection()` encounters a module of type `"gallery"`, it tries to look up `componentMap["gallery"]`, finds `undefined`, and renders nothing. The module silently disappears from the UI with no error logged.

### How to add it

Create a new Gallery component following the app's module conventions:

1. **Create** `src/modules/Gallery.js`:
   ```javascript
   import React from 'react';
   import { View, Image, ScrollView, TouchableOpacity, Text } from 'react-native';
   // Import a lightbox library (e.g., react-native-lightbox-v2, react-native-image-viewing, or custom modal)

   export default function Gallery({ data, options }) {
     // data shape: { images, title, thumbsLimit, thumbDimensions, moduleGalleryMode, ... }
     // options shape: { addClass, thumbWidth, thumbHeight, ... }
     
     const imageList = data.images || [];
     const limit = parseInt(data.thumbsLimit, 10) || imageList.length;
     const displayImages = imageList.slice(0, limit);
     
     const {
       title,
       thumbDimensions = {},
       moduleGalleryMode = 'lg-fade',
       moduleGalleryDownload = false,
       moduleGalleryFullScreen = false,
       carouselOptions = {}
     } = data;
     
     const [selectedIndex, setSelectedIndex] = React.useState(0);
     const [lightboxVisible, setLightboxVisible] = React.useState(false);

     return (
       <View>
         {title && <Text style={styles.title}>{title}</Text>}
         
         {/* Thumbnail grid */}
         <ScrollView horizontal>
           {displayImages.map((img, idx) => (
             <TouchableOpacity
               key={idx}
               onPress={() => {
                 setSelectedIndex(idx);
                 setLightboxVisible(true);
               }}
             >
               <Image
                 source={{ uri: img.thumb || img.src }}
                 style={{
                   width: thumbDimensions.width || 160,
                   height: thumbDimensions.height || 160,
                   marginRight: 8
                 }}
               />
             </TouchableOpacity>
           ))}
         </ScrollView>

         {/* Lightbox Modal */}
         {lightboxVisible && (
           <LightboxModal
             images={displayImages}
             selectedIndex={selectedIndex}
             onClose={() => setLightboxVisible(false)}
             mode={moduleGalleryMode}
             downloadEnabled={moduleGalleryDownload}
             fullScreenEnabled={moduleGalleryFullScreen}
           />
         )}
       </View>
     );
   }
   ```

2. **Register** in `src/modules/index.js`:
   ```javascript
   import Gallery from './Gallery';
   
   const componentMap = {
       // ... existing entries
       gallery: Gallery,  // ← add this line
   };
   ```

3. **Prop contract:** The component receives:
   - `data` (object): The full `item.data` from the API, containing `images`, `title`, `thumbDimensions`, `moduleGalleryMode`, etc.
   - `options` (object): Lightbox configuration object with `addClass`, `thumbWidth`, `thumbHeight`, `allowMediaOverlap`

4. **Content mapping:**
   - Images to display: read from `data.images` array
   - Thumbnail sizing: `data.thumbDimensions.width` and `.height`
   - Lightbox mode: `data.moduleGalleryMode` (e.g., `"lg-fade"`)
   - Download button visibility: `data.moduleGalleryDownload`
   - Full-screen mode: `data.moduleGalleryFullScreen`

5. **Navigation/interaction:**
   - On thumbnail tap: store index and open lightbox modal
   - In lightbox: swipe/arrow keys to navigate images (use carousel library if `data.carousel === true`)
   - Download button (if enabled): trigger image save to device camera roll

6. **Image handling:**
   - Use `data.images[idx].src` for full-resolution lightbox display
   - Use `data.images[idx].thumb` for grid thumbnails (fallback to `src` if no thumb)
   - Apply responsive srcset from `data.images[idx].srcset` if available
   - Respect `data.thumbDimensions.resize` ("fill", "contain", etc.) for thumbnail scaling

## 5. Gotchas & notes

- **No `componentMap` entry:** The module type string must match exactly. Register as lowercase `"gallery"` in `componentMap` to match the layout API's `"type": "gallery"`.
- **Dynamic image loading:** When `data.dynamic === true` and `data.dynamicPath` is set, the app must fetch images from the API path before rendering (this is a pre-render responsibility, not a module responsibility—confirm with HomeScreen/useHomeLayout hook).
- **Lightbox library choice:** The data shape references "lg-fade" and other lightbox modes. Choose a React Native lightbox library that supports animations (e.g., `react-native-image-viewing`, `react-native-lightbox-v2`, or custom modal with Animated API). Ensure it respects `moduleGalleryMode`, `moduleGalleryFullScreen`, and download callbacks.
- **Responsive grid:** `itemsPerRow` is a breakpoint-keyed object (`c0`, `c1`, `c2`, `sc`). The module should respect these to scale thumbnail grid width on tablet vs. phone. Use a helper from the app's responsive utilities or inline media query logic.
- **Thumbnail limit:** `thumbsLimit` may vary by breakpoint (`thumbsLimitTablet`, `thumbsLimitPhone`). Parse and apply the correct limit for the current screen size.
- **Carousel mode:** When `data.carousel === true`, render the main image as a swiper/carousel instead of a static lightbox. The `carouselOptions` object provides `speed`, `autoplay`, `pauseOnHover`, `loop` configuration.
- **Scheduling:** If `data.schedule.between === true` and `from`/`to` are set, apply server-side visibility logic or defer to a parent wrapper (HomeScreen may filter modules by schedule).
- **CSS classes:** The data includes a `classes` object with module-scoped CSS (`module-gallery-838`). Use these for styling hooks if implementing custom lightbox styling.
- **Placeholder images:** If images fail to load, consider a fallback placeholder. The data provides `dummy_image` key if available.
- **Download button:** The `moduleGalleryDownloadVisibility` flag controls whether the download icon appears in the lightbox. Hook it to a native save-to-camera-roll function if the platform supports it.


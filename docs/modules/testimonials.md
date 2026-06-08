# Module: `testimonials`

> **Status:** ✅ Rendered by the app — wired in `src/modules/Testimonials.js`, registered in `componentMap`
> **Layout type string:** `testimonials`  ·  **App component:** — (none)

## 1. What it is

The testimonials module displays a carousel or grid of customer testimonials on the home page. Each testimonial typically includes a header, customer content, footer information, an optional image, and an expandable section via an expand button—useful for building social proof and trust with customer quotes and feedback.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Instance ID | Instance Name |
|----------|-----|-----|------|-------------|---------------|
| bottom   | 2   | 1   | 2    | 256         | Testimonials / Default |

## 3. API `item.data` shape

The testimonials module receives the following fields in `item.data`:

| Field | Type | Purpose |
|-------|------|---------|
| `color_scheme_module` | string | Color scheme identifier (e.g., `"color-scheme-scheme-1"`) |
| `carousel` | boolean | Whether to render as carousel (`true`) or static grid |
| `carouselStyle` | string | Carousel display mode (e.g., `"SLIDER"`) |
| `itemsPerRow` | object | Responsive item counts per breakpoint (`c0`, `c1`, `c2`, `sc`) |
| `display` | string | Display type (e.g., `"grid"`) |
| `title` | string | Optional module title/heading |
| `moduleTitle` | string | Module title constant (e.g., `"DEFAULT"`) |
| `imageDimensions` | object | Image sizing: `width`, `height`, `resize` (e.g., `"fill"`) |
| `items` | object | Key-indexed testimonial items (keys 1–10); each contains: |
| └─ `items[n].header` | string | Testimonial header text |
| └─ `items[n].content` | string | Main testimonial body/quote |
| └─ `items[n].image` | string | Testimonial author/product image URL |
| └─ `items[n].title` | object | Author name or title object |
| └─ `items[n].footer` | string | Footer section text |
| └─ `items[n].footerText` | string | Additional footer text |
| └─ `items[n].footerButton` | string | Footer button label |
| └─ `items[n].footerButtonLink` | object | Link target for footer button |
| └─ `items[n].expandButton` | boolean | Show/hide expand button for additional content |
| └─ `items[n].contentType` | string | Content type identifier |
| └─ `items[n].index` | number | Item index in list |
| └─ `items[n].id` | string | Unique testimonial ID |
| `carouselOptions` | object | Carousel config: `speed`, `autoplay`, `pauseOnHover`, `loop` |
| `schedule` | object | Display schedule: `from`, `to`, `between` (currently inactive) |
| `status` | boolean | Module active/inactive flag |
| `module_id` | number | Unique module instance ID (e.g., `256`) |

## 4. How the app renders it

**Status:** The `componentMap` in `src/modules/index.js` (line 12–20) does NOT contain an entry for `testimonials`. This means when `HomeScreen` calls `renderSection(...)` for a module with `type: "testimonials"`, the `componentMap` lookup returns `undefined` and the section silently renders nothing—no error, no fallback, just skipped.

### How to add it

To render testimonials in the app, follow these steps:

1. **Create the component** at `src/modules/Testimonials.js`:
   ```javascript
   import React from 'react';
   import { View, Text, Image, FlatList, ScrollView, TouchableOpacity } from 'react-native';
   import styles from './styles'; // Adjust to your style structure

   export default function Testimonials({ data, options }) {
     const items = data?.items || [];
     const itemList = Object.values(items).filter(Boolean);

     const renderTestimonial = ({ item }) => (
       <View style={styles.testimonialCard}>
         {item.image && (
           <Image
             source={{ uri: item.image }}
             style={{
               width: options?.imageDimensions?.width || 80,
               height: options?.imageDimensions?.height || 80,
             }}
             resizeMode={options?.imageDimensions?.resize || 'contain'}
           />
         )}
         {item.header && <Text style={styles.header}>{item.header}</Text>}
         {item.content && <Text style={styles.content}>{item.content}</Text>}
         {item.title && (
           <Text style={styles.title}>
             {typeof item.title === 'string' ? item.title : item.title.text}
           </Text>
         )}
         {item.footer && <Text style={styles.footer}>{item.footer}</Text>}
         {item.footerButton && item.footerButtonLink && (
           <TouchableOpacity onPress={() => handleFooterButtonPress(item.footerButtonLink)}>
             <Text style={styles.footerButton}>{item.footerButton}</Text>
           </TouchableOpacity>
         )}
       </View>
     );

     if (data?.carousel) {
       return (
         <ScrollView horizontal pagingEnabled={data.carouselStyle === 'SLIDER'}>
           {itemList.map((item, idx) => (
             <View key={item.id || idx}>{renderTestimonial({ item })}</View>
           ))}
         </ScrollView>
       );
     }

     return (
       <FlatList
         data={itemList}
         renderItem={renderTestimonial}
         keyExtractor={(item, idx) => item.id || idx.toString()}
         numColumns={data?.itemsPerRow?.c0?.[0] || 1}
         scrollEnabled={false}
       />
     );
   }
   ```

2. **Register in `src/modules/index.js`** (around line 19–20):
   ```javascript
   import Testimonials from './Testimonials';

   const componentMap = {
       // ... existing entries ...
       testimonials: Testimonials,
   };
   ```

3. **Follow conventions from existing modules:**
   - Read the prop contract: `data` = `item.item.data` (carousel, itemsPerRow, imageDimensions, items), `options` = `item.item.data` (for styling/config)
   - Use `getPlaceholderImage(item.image)` if a helper exists (check `src/utils` or similar)
   - Handle responsive layout via `itemsPerRow` breakpoints (`c0`, `c1`, `c2`, `sc`)
   - Conditionally render carousel vs. grid based on `data.carousel`
   - Use FlatList for grid or ScrollView with horizontal/pagingEnabled for carousels (see `MasterSlider` or `Products` for reference)

## 5. Gotchas & notes

- **Carousel breakpoints:** The `itemsPerRow` field is an object keyed by breakpoint (`c0`, `c1`, `c2`, `sc`). Each value is typically an array—extract the first element to get the numeric count.
- **Nested title:** The `title` field inside each item is typed as `object`, not a string. Check if it has a `.text` property before rendering.
- **Footer link handling:** `footerButtonLink` is an object (likely `{ url: "...", type: "..." }`). Map it to `navigation.navigate()` or `Linking.openURL()` based on the link type.
- **Image dimensions:** If `imageDimensions.width` or `.height` is `null`, provide sensible defaults (e.g., 80x80 for author avatars).
- **Carousel options:** The module supports `carouselOptions` with `speed`, `autoplay.delay`, `pauseOnHover`, and `loop`. Wire these into your carousel library (Swiper, react-native-snap-carousel, etc.) if needed.
- **Expand button:** The `expandButton` flag suggests some testimonials have collapsible content; the schema shows `items[n].items` as `"[…0]"` (nested array, currently empty). Prepare the component to handle expandable sections.
- **No placeholder images documented:** Unlike products/banners, testimonials don't mention `getPlaceholderImage`. Falls back to the raw image URL from `item.image`.

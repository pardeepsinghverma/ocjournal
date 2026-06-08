# Module: `marquee`

> **Status:** ✅ Rendered by the app — wired in `src/modules/Marquee.js`, registered in `componentMap`
> **Layout type string:** `marquee`  ·  **App component:** — (none)

## 1. What it is

A scrolling text marquee (horizontal text scroller) that displays promotional messages or announcements in a looping carousel format. Typically used for high-visibility promotional bars (e.g., "Free Shipping", seasonal offers) that repeat across the screen.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Instance ID | Instance Name |
|----------|-----|-----|------|-------------|---------------|
| top      | 3   | 1   | 1    | 407         | Marquee / Free Shipping |

## 3. API `item.data` shape

The marquee module receives the following data fields in `item.item.data`:

| Field | Type | Purpose |
|-------|------|---------|
| `color_scheme_module` | string | CSS class or color scheme identifier for module styling (currently empty) |
| `schedule` | object | Visibility schedule with `from`, `to`, and `between` flag; controls when marquee is displayed |
| `imageDimensions` | object | Dimensions object with `width`, `height`, and `resize` mode (e.g., "fill") |
| `repeat` | string | Number of times to repeat/loop the marquee items (e.g., "5") |
| `status` | boolean | Active/inactive flag for the module (true = enabled) |
| `module_id` | number | Unique identifier for this module instance (407) |
| `classes` | array | CSS class list for styling (typically "module" + 5 additional classes) |
| `name` | string | Human-readable module name (e.g., "Marquee / Free Shipping") |
| `image_width` | number | Optional: width override for images (null if not set) |
| `image_height` | number | Optional: height override for images (null if not set) |
| `image_resize` | string | Image resizing mode ("fill", "contain", "cover", etc.) |
| `dummy_image` | string | Base64-encoded placeholder image for fallback |
| `items` | object | Marquee text items; keyed object where each item has: `type` (string), `title` (string), `link` (object), `index` (number), `id` (string), `classes` (array) |

The real content lives in the `items` object. Each marquee item has a `title` (the scrolling text to display) and an optional `link` object that likely contains navigation targets (e.g., `product_id`, `category_id`).

## 4. How the app renders it

**Current state:** `componentMap` in `src/modules/index.js` **has no entry** for the `marquee` type. This means:

- When `HomeScreen.renderSection` (src/Tabs/Home/HomeScreen.js, lines 73–103) evaluates a marquee module, it retrieves `ModuleComponent = componentMap['marquee']`, which is `undefined`.
- The conditional at line 90 (`ModuleComponent ? ... : null`) returns `null`, so the marquee silently renders nothing on screen.

### How to add it

To enable marquee rendering in the app, follow this recipe:

1. **Create the component** at `src/modules/Marquee.js`:
   ```javascript
   import React from 'react';
   import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
   import { getPlaceholderImage } from '../utils/getImage';

   const Marquee = ({ data, options }) => {
     const { width: windowWidth } = useWindowDimensions();
     
     // `data` is `item.item.data.items` (the marquee items)
     // `options` is `item.item.data` (includes repeat, imageDimensions, etc.)
     
     const repeatCount = parseInt(options.repeat) || 1;
     const marqueeItems = Array.from({ length: repeatCount }).flatMap(() => 
       Object.keys(data).map((key) => ({ ...data[key], key: `${key}-${Math.random()}` }))
     );
     
     return (
       <View style={[styles.container, { width: windowWidth - 28 }]}>
         <ScrollView 
           horizontal 
           scrollEventThrottle={16}
           showsHorizontalScrollIndicator={false}
           style={styles.scrollView}
         >
           <View style={styles.marqueeTrack}>
             {marqueeItems.map((item) => (
               <View key={item.key} style={styles.marqueeItem}>
                 <Text style={styles.marqueeText}>{item.title}</Text>
               </View>
             ))}
           </View>
         </ScrollView>
       </View>
     );
   };

   const styles = StyleSheet.create({
     container: {
       overflow: 'hidden',
       backgroundColor: '#f0f0f0',
       borderRadius: 8,
       marginVertical: 10,
     },
     scrollView: {
       flex: 1,
     },
     marqueeTrack: {
       flexDirection: 'row',
       alignItems: 'center',
       paddingHorizontal: 10,
     },
     marqueeItem: {
       paddingHorizontal: 20,
       justifyContent: 'center',
       minHeight: 40,
     },
     marqueeText: {
       fontSize: 14,
       fontWeight: '600',
       color: '#333',
       whiteSpace: 'nowrap',
     },
   });

   export default Marquee;
   ```

2. **Register in** `src/modules/index.js`:
   ```javascript
   import Marquee from './Marquee';
   
   const componentMap = {
       // ... existing entries ...
       marquee: Marquee,
   };
   ```

3. **Prop contract** (as called by HomeScreen.renderSection):
   - `data={item.item.data.items || []}` — the marquee text items (keyed object)
   - `options={item.item.data}` — full options including `repeat`, `imageDimensions`, `status`, `schedule`, `color_scheme_module`

4. **Follow conventions** from `src/modules/banner.js` and `src/modules/Products.js`:
   - Accept `data` and `options` as props
   - Iterate over `Object.keys(data)` to render each item
   - Use `getPlaceholderImage()` if the marquee has images
   - Use `useNavigation()` and `navigation.navigate()` if items have links (check `item.link.product_id` or `item.link.category_id`)
   - Wrap the component in a `<View>` with responsive styling

## 5. Gotchas & notes

- **No placeholder images** — The marquee.json instance does not include image fields in the individual items; it stores a `dummy_image` at the module level but individual marquee items have `type` and `title` only. The component should render text-only or fetch images separately if needed.
- **Repeat count** — The `repeat` field (e.g., "5") controls how many times the marquee items loop. Parse it as an integer: `parseInt(options.repeat) || 1`.
- **Schedule support** — The `schedule` object with `from`, `to`, and `between` flag allows the marquee to be shown/hidden by date/time. The component should check `options.schedule.status` or `options.status` to conditionally render.
- **Link handling** — Each marquee item has a `link` object. Implement navigation like the banner module (lines 16–24 in `src/modules/banner.js`) to handle `product_id`, `category_id`, or fallback to `catalog`.
- **Color scheme** — The `color_scheme_module` field (currently empty in this instance) may contain CSS class names or color codes for theming. Consider mapping it to style variants.
- **CSS classes** — The `classes` array is included in the data shape but typically applies to the module container. Apply them via inline styles or a mapping utility.
- **Animation** — A true marquee animation (auto-scrolling, endless loop) will require a React Native animation library (e.g., `react-native-reanimated`) or a timed `setInterval` with `ScrollView.scrollTo()`. The simple horizontal ScrollView approach above is static.


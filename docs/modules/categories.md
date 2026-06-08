# Module: `categories`

> **Status:** ✅ Rendered by the app  
> **Layout type string:** `categories`  ·  **App component:** `Category` (src/modules/category.js)

## 1. What it is

The categories module displays a grid of product categories as interactive cards. Each category shows a thumbnail image and name, allowing users to browse and navigate to filtered product catalogs based on category selection. The module is primarily designed to showcase top-level product categories on the e-commerce home page.

## 2. Where it appears in the live home layout

| Position | Row | Column | Item | Instance ID | Instance Name |
|----------|-----|--------|------|-------------|---------------|
| top      | 6   | 1      | 2    | 1101        | Categories / Large Card |

## 3. API `item.data` shape

The categories module expects the following fields in `item.data`:

| Field | Type | Purpose |
|-------|------|---------|
| `items` | Object | The primary content container—maps to the `data` prop passed to Category component. Each key contains a `categories` object with the actual category data. |
| `title` | String | Display title for the section (e.g., "Categories"). |
| `moduleCategory` | String | Layout style (e.g., "LARGE" for large card display). |
| `moduleCategoryButtonDisplay` | String | Controls button display mode (e.g., "both"). |
| `carousel` | Boolean | Whether to enable carousel/swipeable mode. |
| `carouselStyle` | String | Visual style for carousel (e.g., "DEFAULT"). |
| `imageDimensions` | Object | Image sizing rules with `width`, `height`, and `resize` properties. |
| `productsCount` | Boolean | Whether to display product count badge. |
| `productsCountText` | String | Template string for product count display (e.g., "%s Product(s)"). |

**Real content location:** The actual category items live in `item.data.items[key].categories`, where each category object must contain:
- `category_id` (string, converted to integer `id`)
- `name` (string)
- `thumb` (string, mapped to `image` field)

## 4. How the app renders it

**ComponentMap entry:** The module is registered in `src/modules/index.js` line 18:
```javascript
categories: Category,
```

**Component:** `src/modules/category.js` exports the `Category` function (line 67).

**Prop contract:**  
HomeScreen (src/Tabs/Home/HomeScreen.js:93-97) passes:
```javascript
<ModuleComponent
  key={mId}
  data={item.item.data.items || []}
  options={item.item.data}
/>
```

The `Category` component receives `data` prop—an object where each key maps to items containing a `categories` field.

**Data transformation:**  
The `mapCategories()` function (line 50-62) normalizes the raw API structure:
- Converts `category_id` string → integer `id`
- Maps `name` → `name`
- Maps `thumb` → `image`
- Initializes `subCategories: []`

**Rendering logic:**  
The Category component (line 143-157):
1. Iterates over keys in the `data` object
2. Calls `mapCategories(item.categories)` to transform each category group
3. Renders each category via either `CategoryRounded` (default, line 149) or `CategoryCard` (currently disabled via hardcoded `style = 'rounded'` on line 64)
4. Hard-coded section title: `<MSection title={'Category'} titleLevel={'4'} ScrollDirection={'horizontal'}>`

**Navigation:**  
Both `CategoryCard` (line 11) and `CategoryRounded` (line 36) navigate on press:
```javascript
navigation.navigate('catalog', { categoryId: category.id, categoryName: category.name })
```

**Image handling:**  
Images are loaded via `getPlaceholderImage()` (src/utils/getImage.js:10):
- `CategoryCard` uses 160×240 dimensions (line 26)
- `CategoryRounded` uses 80×80 dimensions (line 43)
- Returns placeholder URL `https://placehold.co/{width}x{height}/EEE/c3c3c3.png` (currently always returns placeholder; original image URL logic is commented out at lines 12-21)

## 5. Gotchas & notes

- **Style hardcoded:** The component currently renders only `CategoryRounded` cards (80×80 images with centered text below). The `CategoryCard` style (160×240 card layout) is available but disabled via line 64 (`const style = 'rounded'`). No prop to switch styles at runtime.

- **Placeholder images:** `getPlaceholderImage()` has commented-out logic (lines 12-21) that would validate the image URL; currently it always returns a placeholder regardless of input. This means all category images will display the same gray placeholder until the validation logic is re-enabled.

- **Section title hard-coded:** The section title renders as "Category" from the component (line 144), not from the API `title` field in `item.data`. Title customization via layout API is ignored.

- **Scroll direction hard-coded:** Horizontal scrolling is hard-coded in `MSection` (line 144). The `carousel` and `carouselStyle` fields from the API data shape are not used.

- **No responsive handling:** The `itemsPerRow`, `sectionsDisplayTablet`, and `sectionsDisplayPhone` fields in the API data shape are parsed but not used by the Category component; they may be intended for future responsive design.

- **Missing error handling:** If `data` contains a malformed `categories` object (not an object or missing `category_id`), the `mapCategories()` function will throw (line 52). No fallback or graceful degradation.

- **SubCategories unused:** The data shape includes `subCategories: []` initialization but no rendering logic for nested category hierarchies.

- **Navigation target:** Navigates to 'catalog' screen with `categoryId` and `categoryName`; assumes that route exists in the navigation stack.

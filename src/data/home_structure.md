# home.json Structure Documentation

This document describes the JSON schema and data organization of `home.json`, an OpenCart Journal 3 theme export file for the home page.

## 1. Top-Level Keys

The root of the JSON object contains localization strings, formatting rules, and the main storefront configuration.

| Key | Type | Description |
| :--- | :--- | :--- |
| `code` | String | Language code (e.g., "en"). |
| `direction` | String | Text direction ("ltr" or "rtl"). |
| `date_format_short` | String | PHP-style short date format. |
| `date_format_long` | String | PHP-style long date format. |
| `time_format` | String | PHP-style time format. |
| `datetime_format` | String | PHP-style datetime format. |
| `decimal_point` | String | Decimal separator. |
| `thousand_point` | String | Thousands separator. |
| `text_*` | String | Localization strings for UI elements (e.g., `text_home`, `text_yes`). |
| `button_*` | String | Localization strings for buttons (e.g., `button_cart`, `button_checkout`). |
| `error_*` | String | Localization strings for error messages. |
| `datepicker` | String | Datepicker language locale. |
| `backup` | String (JSON) | A stringified JSON object containing a backup of core settings. |
| `_storefront` | Object | The primary data structure for page layout and modules. |

---

## 2. Storefront Structure (`_storefront`)

The `_storefront` object defines how the page is assembled.

- **`route`**: The internal route (e.g., `"journal3/common/home"`).
- **`layout_id`**: The ID of the layout in the database.
- **`layout`**: An object containing various page sections.

### Page Sections (`_storefront.layout`)
Each section represents a portion of the page:
- `column_left`
- `column_right`
- `content_top`
- `content_bottom`
- `top` (Active in this file)
- `bottom` (Active in this file)
- `footer_top`
- `footer_bottom`
- `global`

---

## 3. Layout Hierarchy

The layout follows a strict nesting pattern:
**Section** ➔ **Rows** ➔ **Columns** ➔ **Items** ➔ **Module**

### Row Structure
Each row in a section's `rows` object contains:
- `color_scheme`: Optional color scheme ID.
- `background`: Object containing CSS background properties (`background-color`, `gradient`, `background-position`, etc.).
- `classes`: Object of CSS classes applied to the row.
- `columns`: Object containing one or more columns.

### Column Structure
Each column in a row's `columns` object contains:
- `classes`: List of CSS classes.
- `items`: Object containing modules placed within this column.

### Item Structure
Each item in a column's `items` object contains:
- `classes`: List of CSS classes.
- `item`: The actual module definition.
    - `id`: Unique ID for the module instance.
    - `name`: Human-readable name.
    - `type`: Module type (see Section 4).
    - `data`: Type-specific configuration.

---

## 4. Module Types Registry

The `item.type` field determines the structure of `item.data`.

### Common Field Objects
Many modules share these sub-structures:
- **`link`**: `{ type: string, id: string, href: string, name: string, ... }`
- **`imageDimensions`**: `{ width: number, height: number, resize: string }`
- **`schedule`**: `{ from: string, to: string, between: boolean }`

### Detailed Types

#### `slider`
Used for hero sliders.
- **Data fields**: `autoplay`, `loop`, `parallax`, `navigation`, `pagination`, `items` (Array of slides).
- **Inner Items**: Each slide can have text layers, buttons, and hotspots.

#### `products`
Displays a grid or carousel of products.
- **Data fields**: `sectionsDisplay`, `carousel`, `filter` (e.g., Latest, Featured), `itemsPerRow`.

#### `banners`
Displays image banners.
- **Data fields**: `bannerStyle`, `gridType`, `items` (Array of banner images with links).

#### `marquee`
Scrolling text or image bar.
- **Data fields**: `repeat`, `speed`, `pauseOnHover`.

#### `info_blocks`
Feature highlights with icons/images.
- **Data fields**: `style`, `itemsPerRow`, `items` (Array of blocks).

#### `categories`
Links to product categories.
- **Data fields**: `moduleCategory`, `images`, `itemsPerRow`.

#### `grid`
A recursive layout element allowing nested rows/columns.
- **Data fields**: Contains its own `rows` and `grid_classes`.

#### `manufacturers`
Logos or names of brands.
- **Data fields**: `moduleManufacturers`, `carousel`.

#### `testimonials`
Customer reviews.
- **Data fields**: `carousel`, `items` (Array of quotes).

#### `blog_posts`
Recent articles from the journal blog.
- **Data fields**: `display`, `limit`, `carousel`.

#### `gallery`
Image or video gallery.
- **Data fields**: `productImages`, `carousel`.

#### `title`
Heading or section separator.
- **Data fields**: `title`, `subtitle`, `label`.

---

## 5. Metadata and Blobs

- **`backup` string**: Found at the top level. It stores a serialized version of common settings, likely for portability or restoration.
- **`lazyload_placeholder`**: Base64 encoded small images used during loading states.
- **`classes`**: Heavily used throughout all levels to apply Journal 3 specific styling frameworks styles.

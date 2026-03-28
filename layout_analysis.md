# Analysis of `layout1.json`

This document provides a comprehensive analysis of the `layout1.json` file, detailing its structure, UI handling, and functional aspects within the application.

## Overview
`layout1.json` serves as the blueprint for dynamic page rendering. It follows a hierarchical "Page Builder" pattern, where the UI is broken down into Sections, Rows, Columns, and Modules.

---

## 1. Core Structure Hierarchy

The JSON is organized into high-level sections that represent different parts of a page:

- `column_top`: The main content area (usually home page sections).
- `header`: Navigation and site-wide top elements.
- `footer`: Site-wide bottom elements.
- `column_left` / `column_right`: (If present) Sidebars.

### The Grid System
Each section (like `column_top`) defines its layout using a nested grid:
1. **Rows**: Vertical sections of the page.
2. **Columns**: Horizontal divisions within a row (e.g., a 2-column layout).
3. **Items**: Placeholders for modules within a column.

---

## 2. Module System
The most critical part of the JSON is how components are defined. Each module has a `type` which maps to a React component in the codebase (see `src/modules/index.js`).

### Common Module Types:
| Type | Purpose | Component mapping |
| :--- | :--- | :--- |
| `categories` | Circular/Grid category navigation | `Category` |
| `master_slider` | Hero banners with text layers and animations | `MasterSlider` |
| `banners` | Static promotional image blocks | `Banner` |
| `products` | Product carousels or grids | `Products` |
| `info_blocks` | Highlighted features (e.g., "Free Shipping") | `InfoBlocks` |

---

## 3. UI Aspects
The JSON handles visual representation through several key property groups:

### Responsive Grid Control (`itemsPerRow`)
Modules define how many items are visible based on screen width:
- `c0`: Desktop/Large screens.
- `1080`: Tablet landscape.
- `760`: Tablet portrait / Mobile.
- `sc`: Special conditions or very small screens.

### Image & Dimensions (`imageDimensions`)
- `width` and `height`: Target aspect ratio.
- `resize`: Methods like `fill`, `fit`, or `cover`.
- `thumb`: Specific URL for optimized thumbnails.

### Styling & CSS Classes
Every level (Row, Column, Module) contains a `classes` array. While these are likely inherited from a web-based CMS (e.g., `builder-row`, `grid-col`), the mobile app uses these as identifiers or potentially maps them to local styles.

---

## 4. Functional & Logic Aspects

### Navigation (`link`)
Most items contain a `link` object used for user interaction:
- `type`: Can be `product`, `category`, `page`, or `url`.
- `id`: The internal ID of the target resource.
- `href`: Direct URL link.

### Scheduling & Visibility (`schedule`)
Rows and modules support time-based visibility:
- `from` / `to`: Date/Time range for the module to be active.
- `status`: A boolean flag to toggle the component on/off globally.

### Carousel Logic (`carouselOptions`)
For components that support sliding (e.g., Banners, Products):
- `autoplay`: Boolean.
- `speed`: Transition duration.
- `loop`: Infinite sliding.
- `pauseOnHover`: UX control.

### Animation Settings (`data`)
Slider layers use a `data` array to store complex animation instructions:
- `data-effect`: (e.g., `fade`, `slideLeft`)
- `data-duration`: How long the animation lasts.
- `data-delay`: Staggered entry timing for multiple layers.
- `data-ease`: Easing functions (e.g., `easeInOutQuad`).

---

## 5. Data Flow (How it's used)
1. **Fetching**: The app (specifically `HomeScreen.js`) loads the JSON.
2. **Iteration**: It maps through `column_top.modules[0].rows`.
3. **Component Mapping**: For each module, it looks up the `module_type` in `componentMap`.
4. **Injection**: It passes the `items` and `options` from the JSON directly into the React component as props.
5. **Rendering**: The component (e.g., `Banner.js`) uses `getScaledDimensions` and other utilities to translate the JSON properties into React Native styles and components.

# Module: `grid`

> **Status:** ⚙️ Wired recursively in `src/modules/Grid.js` (registered in `componentMap`) — renders empty until the backend attaches `data` to nested grid modules (Storefront API limitation).
> **Layout type string:** `grid`  ·  **App component:** — (none)

## 1. What it is

The `grid` module is a recursive layout container that allows developers to create complex, nested page layouts within the home page. It acts as a sub-layout system, embedding its own rows and columns with their own modules inside a grid-based structure. This is useful for building multi-column sections or advanced compositional designs with mixed content types.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Instance ID | Instance Name |
|----------|-----|-----|------|-------------|---------------|
| top | 7 | 1 | 1 | 800 | Builder / Countdown + Products |

## 3. API `item.data` shape

The `grid` module receives a data object with the following structure:

| Field | Type | Purpose |
|-------|------|---------|
| `grid_classes` | array | CSS class identifiers applied to the grid container (e.g., `"module"`, custom layout classes). |
| `rows` | object | The core content: a nested rows object (same structure as top-level `_storefront.layout.rows`). Each row contains its own `columns`, which contain their own `items` (which themselves have module definitions). |
| `edit` | string | Admin edit path (e.g., `"module_layout/grid/edit/800"`). Read-only metadata. |
| `name` | string | Human-readable name of the grid instance (e.g., `"Builder / Countdown + Products"`). |

The `rows` object within the grid repeats the standard layout hierarchy: each row has a `columns` object, each column has an `items` object, and each item contains a nested module definition with its own `type` and `data`.

Key content fields depend on the modules nested inside the grid (they could contain `products`, `banners`, `categories`, `title`, etc.). The grid itself just provides the structural container and layout classes.

## 4. How the app renders it

**Current status:** NOT RENDERED — The `grid` module type is missing from the `componentMap` in `src/modules/index.js`.

### Why it doesn't render
Looking at `src/modules/index.js` (lines 12–20), the `componentMap` exports only these module types:
```javascript
const componentMap = {
    master_slider: MasterSlider,
    slider: MasterSlider,
    products: Products,
    info_blocks: InfoBlocks,
    banners: Banner,
    categories: Category, 
    title: Title,
};
```

There is no `grid: Grid` entry. When `HomeScreen.js` calls `renderSection()` (line 88), it resolves the module component via `componentMap[mType]`. For `mType = "grid"`, this returns `undefined`, and the condition on line 90 (`ModuleComponent ? ... : null`) causes the section to render nothing.

### How to add it

To enable `grid` rendering, follow this recipe:

1. **Create `src/modules/Grid.js`** (PascalCase filename):
   ```javascript
   import React from 'react';
   import { View } from 'tamagui';
   import { renderSection } from '../modules/layoutRenderer'; // or inline the row-rendering logic
   
   const Grid = ({ data, options }) => {
     // data = the item.data object containing 'rows' and 'grid_classes'
     const rows = data.rows || {};
     const gridClasses = data.grid_classes || [];
     
     // Render the nested rows using the same pattern as HomeScreen.renderSection
     return (
       <View
         style={{
           // Apply grid layout or wrapping if needed
           // gridClasses could inform flex direction, spacing, etc.
         }}
       >
         {Object.keys(rows).map((rowKey) => {
           const row = rows[rowKey];
           const columns = row.columns || {};
           
           return (
             <View key={rowKey} style={{ flex: 1, flexDirection: 'row' }}>
               {Object.keys(columns).map((columnKey) => {
                 const items = columns[columnKey].items || {};
                 
                 return (
                   <View key={columnKey} style={{ flex: 1 }}>
                     {Object.keys(items).map((itemKey) => {
                       const item = items[itemKey];
                       const mType = item.item.type;
                       const mId = item.item.id;
                       const ModuleComponent = componentMap[mType];
                       
                       return ModuleComponent ? (
                         <View key={mId} marginTop={10}>
                           <ModuleComponent
                             data={item.item.data.items || []}
                             options={item.item.data}
                           />
                         </View>
                       ) : null;
                     })}
                   </View>
                 );
               })}
             </View>
           );
         })}
       </View>
     );
   };
   
   export default Grid;
   ```

   **Key points:**
   - Import `View` from `tamagui` (consistent with other modules like `Banner.js`, `Products.js`).
   - Recursively iterate through `data.rows` → `columns` → `items`.
   - For each nested item, look up its module type in `componentMap` and render it.
   - Pass nested module's `item.item.data.items` as `data` and `item.item.data` as `options` (same contract as `HomeScreen.renderSection`).

2. **Register in `src/modules/index.js`**:
   ```javascript
   import Grid from './Grid';
   
   const componentMap = {
       master_slider: MasterSlider,
       slider: MasterSlider,
       products: Products,
       info_blocks: InfoBlocks,
       banners: Banner,
       categories: Category, 
       title: Title,
       grid: Grid,  // ← Add this line
   };
   ```

3. **Test with instance ID 800** ("Builder / Countdown + Products" at layout position top/row 7/col 1). The nested modules inside the grid should now render.

4. **Handle `grid_classes` styling** (optional enhancement): If `grid_classes` contains specific layout hints (e.g., column counts, spacing), parse them and apply to the container `View` styles.

## 5. Gotchas & notes

- **Recursive structure:** The grid's `rows` object is identical to the top-level layout structure. Ensure no infinite recursion by validating that nested grids eventually contain non-grid modules.
- **Module lookup:** All nested modules must already be in `componentMap`. If a nested module is also missing (like another `grid`), that section will render nothing.
- **Data shape:** Unlike modules like `Products` or `Banner`, the grid's real content is in `data.rows`, not `data.items`. Do not try to iterate over `data.items` in a grid component.
- **CSS classes:** `grid_classes` are provided for styling but are typically CSS strings for web. On React Native, these should be parsed and converted to StyleSheet properties if they contain semantic hints (e.g., `"two-col"`, `"full-width"`). Currently, they are often structural metadata (e.g., `"module"`) and can be ignored.
- **Column flex:** The example above uses `flex: 1` for columns, which will distribute space equally. If the layout API specifies column widths elsewhere (not in this module's data), adjust the `View` style accordingly.
- **Edit endpoint:** The `data.edit` field (e.g., `"module_layout/grid/edit/800"`) is for admin UIs and should be ignored in the app.

# Home Screen Layout Map
> **Update:** all 6 previously-dropped module types are now wired (`src/modules/`): `marquee`, `manufacturers`, `testimonials`, `blog_posts`, `gallery` render content; `grid` is wired recursively but renders empty pending a backend change. The tables below are updated; the ASCII diagram further down still shows the original pre-wiring drop state for reference.

## Overview

The OCJournal home screen is **data-driven** and renders a live layout from the Storefront JSON API. The layout is fetched from `common/home` and stored in the app's state as `_storefront.layout`. The rendering engine walks a hierarchical tree structure (position → rows → columns → items) and uses a **componentMap** to resolve layout types to React Native components. Only modules with mapped components render; unmapped types silently drop.

See [Backend API Integration Guide](../Backend-API-Integration-Guide.md) for API contract details.

---

## How the Layout Engine Works

**File:** `src/Tabs/Home/HomeScreen.js` (lines 73–103)

The `renderSection(sectionRows)` function recursively walks the layout tree:

```javascript
const renderSection = (sectionRows) => {
  if (!sectionRows) return null;
  
  return Object.keys(sectionRows).map((key) => {
    const row = sectionRows[key];
    const columns = row.columns;

    return Object.keys(columns).map((columnKey) => {
      const items = columns[columnKey].items;

      return Object.keys(items).map((itemKey) => {
        const item = items[itemKey];
        const mType = item.item.type;                
        const mId = item.item.id;                
        const ModuleComponent = componentMap[mType];
        
        return ModuleComponent ? (
          <View marginTop={10}>
            <ModuleComponent
              key={mId}
              data={item.item.data.items || []}
              options={item.item.data}
            />
          </View>
        ) : null;
      });
    });
  });
};
```

**Tree structure:**
1. **Position** — `top` or `bottom` (stored in contentTop/contentBottom state)
2. **Row** — horizontal row container (object keyed by row index)
3. **Column** — column within a row (object keyed by column index)
4. **Item** — individual module instance (object keyed by item index)
5. **Module** — resolved via `componentMap[item.item.type]`

**Prop contract:**
- `data`: `item.item.data.items` (array of data items; defaults to `[]`)
- `options`: `item.item.data` (full data object with styling, metadata, etc.)

**Unmapped types:** If `componentMap[mType]` returns falsy, the module renders nothing (line 99 returns `null`).

---

## Live Home Layout Map

**Source:** the live `common/home` Storefront JSON API response (`_storefront.layout`)  
**Active positions:** `top` (7 rows), `bottom` (4 rows) — all other positions are empty

| Pos | Row | Col | Item | Type | ID | Name | Rendered? |
|-----|-----|-----|------|------|----|----|-----------|
| top | 1 | 1 | 1 | `slider` | 871 | Slider / Default / Image Layer / Hotspots | ✅ |
| top | 2 | 1 | 1 | `banners` | 798 | Simple Banners / Bento 9 / Left | ✅ |
| top | 2 | 2 | 1 | `banners` | 797 | Simple Banners / Bento 9 / Right | ✅ |
| top | 3 | 1 | 1 | `marquee` | 407 | Marquee / Free Shipping | ✅ |
| top | 4 | 1 | 1 | `title` | 1099 | Title / Home / Featured Products Copy | ✅ |
| top | 4 | 1 | 2 | `products` | 867 | Products / Home / New Arrivals from Category | ✅ |
| top | 5 | 1 | 1 | `info_blocks` | 781 | Info Blocks / Site Features | ✅ |
| top | 6 | 1 | 1 | `title` | 1048 | Title / Home / Shop by Category | ✅ |
| top | 6 | 1 | 2 | `categories` | 1101 | Categories / Large Card | ✅ |
| top | 7 | 1 | 1 | `grid` | 800 | Builder / Countdown + Products | ⚙️ |
| bottom | 1 | 1 | 1 | `title` | 639 | Title / Home / Shop by Brand | ✅ |
| bottom | 1 | 1 | 2 | `manufacturers` | 997 | Brands / Default | ✅ |
| bottom | 2 | 1 | 1 | `title` | 643 | Title / Home / What are people saying about us | ✅ |
| bottom | 2 | 1 | 2 | `testimonials` | 256 | Testimonials / Default | ✅ |
| bottom | 3 | 1 | 1 | `blog_posts` | 998 | Blog Posts / Latest Articles / Tabs | ✅ |
| bottom | 4 | 1 | 1 | `title` | 593 | Title / Home / Enhanced Gallery Module | ✅ |
| bottom | 4 | 1 | 2 | `gallery` | 838 | Gallery / Simple Carousel | ✅ |

**Summary:** 17 module instances. After this session **all are wired** — 16 render content (incl. 5 `title` headings); `grid` (1) is wired but renders empty pending backend nested-module data.

---

## ComponentMap Coverage

**Source:** `src/modules/index.js`

| Layout Type | App Component | Status |
|-------------|---------------|--------|
| `slider` | `MasterSlider` | ✅ Rendered |
| `master_slider` | `MasterSlider` | ✅ Rendered |
| `banners` | `Banner` | ✅ Rendered |
| `title` | `Title` | ✅ Rendered |
| `products` | `Products` | ✅ Rendered |
| `info_blocks` | `InfoBlocks` | ✅ Rendered |
| `categories` | `Category` | ✅ Rendered |
| `marquee` | `Marquee` | ✅ Rendered |
| `grid` | `Grid` | ⚙️ Wired (empty — backend) |
| `manufacturers` | `Manufacturers` | ✅ Rendered |
| `testimonials` | `Testimonials` | ✅ Rendered |
| `blog_posts` | `BlogPosts` | ✅ Rendered |
| `gallery` | `Gallery` | ✅ Rendered |

**Coverage:** ✅ All **12** distinct live module types are now wired into the `componentMap`. 11 render content; `grid` is wired recursively but renders empty pending a backend change (the Storefront API does not attach `data` to nested grid modules).

---

## ASCII Diagram — Home Screen Scroll View

```
┌────────────────────────────────────────┐
│        SCROLL VIEW (Home Screen)        │
└────────────────────────────────────────┘
              ⬇️ User scrolls
            ┌──────────┐
            │   TOP    │
            │ Position │
            └──────────┘
              ⬇️ 
┌────────────────────────────────────────┐
│ Row 1, Col 1: Slider (ID 871)          │ ✅
│ → MasterSlider renders                 │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 2, Col 1: Banners Left (ID 798)    │ ✅
│ → Banner renders                       │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 2, Col 2: Banners Right (ID 797)   │ ✅
│ → Banner renders                       │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 3, Col 1: Marquee (ID 407)         │ ⚠️
│ → DROPPED (marquee not in componentMap)│
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 4, Col 1, Item 1: Title (ID 1099)  │ ✅
│ → Title renders                        │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 4, Col 1, Item 2: Products (ID 867)│ ✅
│ → Products renders                     │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 5, Col 1: Info Blocks (ID 781)     │ ✅
│ → InfoBlocks renders                   │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 6, Col 1, Item 1: Title (ID 1048)  │ ✅
│ → Title renders                        │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 6, Col 1, Item 2: Categories       │ ✅
│ (ID 1101) → Category renders           │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 7, Col 1: Grid (ID 800)            │ ⚠️
│ → DROPPED (grid not in componentMap)   │
└────────────────────────────────────────┘
              ⬇️ [Divider]
            ┌──────────┐
            │ BOTTOM   │
            │ Position │
            └──────────┘
              ⬇️
┌────────────────────────────────────────┐
│ Row 1, Col 1, Item 1: Title (ID 639)   │ ✅
│ → Title renders                        │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 1, Col 1, Item 2: Manufacturers    │ ⚠️
│ (ID 997) → DROPPED (not in componentMap)
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 2, Col 1, Item 1: Title (ID 643)   │ ✅
│ → Title renders                        │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 2, Col 1, Item 2: Testimonials     │ ⚠️
│ (ID 256) → DROPPED (not in componentMap)
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 3, Col 1: Blog Posts (ID 998)      │ ⚠️
│ → DROPPED (blog_posts not in componentMap)
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 4, Col 1, Item 1: Title (ID 593)   │ ✅
│ → Title renders                        │
└────────────────────────────────────────┘
                ⬇️
┌────────────────────────────────────────┐
│ Row 4, Col 1, Item 2: Gallery (ID 838) │ ⚠️
│ → DROPPED (gallery not in componentMap) │
└────────────────────────────────────────┘
              ⬇️ [End]
```

---

## Per-Module Documentation Index

- [Slider](slider.md)
- [Banners](banners.md)
- [Title](title.md)
- [Products](products.md)
- [Info Blocks](info_blocks.md)
- [Categories](categories.md)
- [Marquee](marquee.md) ✅
- [Grid](grid.md) ⚙️
- [Manufacturers](manufacturers.md) ✅
- [Testimonials](testimonials.md) ✅
- [Blog Posts](blog_posts.md) ✅
- [Gallery](gallery.md) ✅

✅ — Rendered.  ⚙️ — Wired but awaiting backend data (`grid`).

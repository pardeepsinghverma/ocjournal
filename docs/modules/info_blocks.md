# Module: `info_blocks`

> **Status:** ✅ Rendered by the app
> **Layout type string:** `info_blocks`  ·  **App component:** `InfoBlocks`

## 1. What it is

Displays a grid of informational blocks showcasing site features, policies, or key selling points. Each block contains an icon placeholder, title, and descriptive content, arranged in a flexible grid layout that reflows based on responsive breakpoints.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Instance ID | Instance Name |
|----------|-----|-----|------|-------------|---------------|
| top | 5 | 1 | 1 | 781 | Info Blocks / Site Features |

## 3. API `item.data` shape

| Field | Type | Purpose |
|-------|------|---------|
| `items` | Object (keyed 1–4+) | Array of info block objects; each contains `title`, `content`, `color_scheme`, `link`, `buttonTextNew`, `buttonLink`, `counter`, `button` flag, and `id` |
| `title` | string | Module-level title (not displayed by current component) |
| `description` | string | Module-level description (not displayed by current component) |
| `style` | string | Style preset; e.g., "SIMPLE" |
| `styleButtonStyle` | string | Button styling preset; e.g., "LINK_UNDERLINE" |
| `status` | boolean | Whether the module is active; if false, component returns null |
| `itemsPerRow` | Object | Responsive breakpoint config (c0, c1, c2, sc keys) controlling grid columns per breakpoint |
| `imageDimensions` | Object | `width`, `height`, `resize` ("fill" etc.) for block images |
| `color_scheme` | string | Color scheme identifier |
| `gridType` | string | Grid layout type; e.g., "auto" |
| `schedule` | Object | Activation schedule with `from`, `to`, `between` flags |
| `module_id` | number | Unique module instance ID (781 in live layout) |
| `classes` | Object | CSS class strings for theming and module ID targeting |
| `edit` | string | Admin edit URL path |
| `name` | string | Human-readable module name |

**Real content location:** `items` object (keyed by index) — each item has `title` (required), `content` (optional description text), `id`, and unused navigation fields (`link`, `buttonLink`).

## 4. How the app renders it

**Component file:** `src/modules/InfoBlocks.js`

**ComponentMap entry** (src/modules/index.js:16):
```javascript
info_blocks: InfoBlocks,
```

**Prop contract:** HomeScreen passes `data={item.item.data.items || {}}` and `options={item.item.data}`.

**Render logic** (InfoBlocks.js:8–54):
- **Status check** (line 9): Returns null if `options.status` is false, silently hiding the module.
- **Item extraction** (line 11): Destructures `data` object into an array via `Object.values(data || {})`.
- **Layout** (lines 14–18): Renders a Tamagui `XStack` (horizontal flexbox) with `flexWrap="wrap"`, `gap={10}`, and `justifyContent="space-between"` to flow items left-to-right, two per row on standard screen widths.
- **Item rendering** (lines 20–49): Maps over items, rendering each as a `View` container with:
  - **Width**: `(screenWidth - 48) / 2` — assumes 2 items per row with 48px total padding.
  - **Styling**: `backgroundColor="$gray2"`, `padding={12}`, `borderRadius={8}`, Tamagui design tokens.
  - **Icon placeholder** (lines 31–37): Uses `getPlaceholderImage(null, 24, 24, 'F')` to render a static 24×24 placeholder image (no dynamic icons fetched from data).
  - **Title** (lines 39–41): Bold, 14px text from `item.title`.
  - **Content** (lines 42–46): Optional 12px description text from `item.content` (max 2 lines via `numberOfLines={2}`).

**Field→prop mapping:**
- `item.title` → `<Text>` (block heading)
- `item.content` → `<Text>` (block description)
- `item.id` → React key
- `options.status` → Conditional render gate

**Navigation & images:** No navigation implemented; `link` and `buttonLink` fields in `item` are ignored. Icons are always the placeholder (F character), not sourced from `item` data.

## 5. Gotchas & notes

- **Icon placeholder only:** The component ignores any icon field in the data and always renders a hardcoded placeholder via `getPlaceholderImage()`. To support custom icons, add an `icon` field to the data shape and bind it to the `Image src` attribute.
- **Navigation not wired:** The data shape includes `link` and `buttonLink` fields with no button UI or tap handler; these fields are dead code and should be documented as future (unused, do not rely on).
- **Fixed 2-column layout:** The component hard-codes 2 items per row using `(screenWidth - 48) / 2` and does not respect the `itemsPerRow` breakpoint object in `options`. Responsive grid support would require conditional width calculation based on screen size or Tamagui's `$sm`, `$md` breakpoints.
- **Module-level title & description ignored:** The `options.title` and `options.description` fields are passed but not rendered; only item-level titles are shown.
- **Status gate:** If `options.status === false`, the entire module returns null and disappears from layout with no placeholder or error message.
- **screenWidth calculation:** Via `Dimensions.get('window').width` from React Native; on native platforms, always test landscape orientation edge cases.
- **Unused style/styleButtonStyle:** The `style` ("SIMPLE") and `styleButtonStyle` ("LINK_UNDERLINE") options are present in data but not consumed by the component; these are likely admin controls for future variants or CSS class injection (currently the component uses inline Tamagui tokens).

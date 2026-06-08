# Module: `title`

> **Status:** ✅ Rendered by the app
> **Layout type string:** `title`  ·  **App component:** `Title`

## 1. What it is

A simple text section header that displays a title and optional subtitle above related content modules. Optionally includes an inline call-to-action link (e.g., "Shop all") aligned to the right of the title. Used to organize and label major sections of the home layout.

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Type   | ID   | Name                                          |
|----------|-----|-----|------|--------|------|-----------------------------------------------|
| top      | 4   | 1   | 1    | title  | 1099 | Title / Home / Featured Products Copy         |
| top      | 6   | 1   | 1    | title  | 1048 | Title / Home / Shop by Category               |
| bottom   | 1   | 1   | 1    | title  | 639  | Title / Home / Shop by Brand                  |
| bottom   | 2   | 1   | 1    | title  | 643  | Title / Home / What are people saying about us |
| bottom   | 4   | 1   | 1    | title  | 593  | Title / Home / Enhanced Gallery Module        |

## 3. API `item.data` shape

| Field                    | Type   | Purpose                                               |
|--------------------------|--------|-------------------------------------------------------|
| `type`                   | string | Module type identifier (always `"custom"` in data)   |
| `title`                  | string | Main heading text (e.g., "New Arrivals")             |
| `subtitle`               | string | Optional descriptive text below title                |
| `style`                  | string | Style preset; currently `"DEFAULT"`                 |
| `label`                  | string | Reserved for label text (currently unused)           |
| `styleLabelContainerStyle` | string | Label style preset (e.g., `"MEDIA_LABEL_CAPS"`)     |
| `inline_button_text`     | string | CTA link text (e.g., "Shop all")                    |
| `inline_button_link`     | object | Link metadata for the CTA (see below)                |
| `button_1_text`          | string | Reserved for first button text (currently unused)    |
| `button_1_link`          | object | Reserved for first button link (currently unused)    |
| `button_2_text`          | string | Reserved for second button text (currently unused)   |
| `button_2_link`          | object | Reserved for second button link (currently unused)   |
| `status`                 | bool   | Controls whether the module renders                  |
| `module_id`              | int    | Unique instance ID in the layout API                 |
| `schedule`               | object | Time scheduling (from/to dates, between flag)        |
| `classes`                | array  | CSS class names for styling                          |
| `name`                   | string | Display name in the CMS (e.g., "Title / Home / New Arrivals") |
| `items`                  | array  | Reserved for future use (currently empty)            |

**Real content fields:**
- `title` — the heading text
- `subtitle` — descriptive subtitle  
- `inline_button_text` and `inline_button_link.href` — the optional right-aligned CTA link

## 4. How the app renders it

The `Title` module is registered in `src/modules/index.js:19` in the `componentMap`:

```javascript
title: Title,
```

**Component file:** `src/modules/Title.js:1–38`

**Rendering flow:**
1. `HomeScreen` passes `options={item.item.data}` to the `Title` component (`src/modules/Title.js:5`)
2. The component checks `options.status` and returns `null` if falsy, preventing render (`src/modules/Title.js:6`)
3. Destructures `title`, `subtitle`, `inline_button_text`, and `inline_button_link` from `options` (`src/modules/Title.js:8–13`)
4. Renders a `YStack` wrapper with vertical margins (`src/modules/Title.js:16`)
5. Delegates title + inline link rendering to `MTitle` component (`src/modules/Title.js:17–23`):
   - Passes `title` as the main heading
   - Passes `endTitle={inline_button_text}` and `endLink={inline_button_link?.href}` for the CTA
6. If `subtitle` exists, renders it as gray secondary text below the title (`src/modules/Title.js:24–33`)

**`MTitle` component** (`src/components/MTitle.js:14–44`):
- Uses a `titleMap` (H1–H6) for semantic heading levels; defaults to H4 (`src/components/MTitle.js:5–12, 23`)
- Wraps title and endTitle in an `XStack` with `space-between` alignment so the CTA link floats right (`src/components/MTitle.js:27`)
- Renders `endTitle` as a blue link (via `@react-navigation/native` Link) only if both `endTitle` and `endLink` are defined (`src/components/MTitle.js:33–39`)
- All margins and styling are configurable via props; `marginTop`, `marginBottom`, `level` can be customized (`src/components/MTitle.js:14–21`)

## 5. Gotchas & notes

- **Status gate:** If `options.status` is `false` or missing, the entire module disappears silently; no fallback rendering.
- **Conditional subtitle:** If `subtitle` is empty/falsy, the component renders `null` for that field, reducing vertical space.
- **Inline link optional:** The CTA (endTitle + endLink) only renders if BOTH `inline_button_text` and `inline_button_link.href` are truthy. A missing `href` silently hides the link even if text is present.
- **Link href is extracted:** The component passes only `inline_button_link?.href` (the URL string) to `MTitle`, discarding other link metadata (type, id, name, attrs).
- **Reserved fields unused:** `label`, `button_1_text/link`, `button_2_text/link`, and `items` are defined in the API but not rendered by the current component. They are available for future features.
- **Hardcoded heading level:** `MTitle` defaults to H4 heading level; the `Title` module does not expose a way to customize this, so all titles are rendered at the same semantic level.
- **Tamagui styling:** All styling is via Tamagui tokens (`$gray10`, `$blue10`) and margin props; no custom CSS classes are applied from the `classes` array.
- **No placeholder image:** This module is text-only; image handling via `getPlaceholderImage` does not apply.

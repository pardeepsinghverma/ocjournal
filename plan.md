# Journal 3 Style Parser — React Native Implementation Plan

## How It Works on the Web (verified from backend source code)

### Source files read:
- `catalog/controller/journal3/event/layout.php` — builds the layout cache per layout_id
- `catalog/controller/journal3/skin.php` — generates the CSS variable stylesheet
- `system/library/journal3/options/color.php` — `__SCHEME__` token → `hsla(var(...))` converter
- `system/library/journal3/options/background.php` — background object parser
- `system/library/journal3/options/option.php` — `varName()` function
- `system/library/journal3/options/parser.php` — the setting → CSS/PHP pipeline
- `system/library/journal3/data/settings/layout/row.json` — every row setting definition

---

### The Four-Stage Pipeline

**Stage 1 — Admin stores raw JSON in the database**

In `oc_journal3_skin_setting` and `oc_journal3_module` tables, background settings are stored as raw JSON:

```json
{
  "background-color": {
    "color": "__SCHEME__background_primary",
    "lightness": 0,
    "alpha": 1
  },
  "gradient": "background-image: linear-gradient(109.6deg, rgba(0,0,0,0.93) 11.2%, rgb(63,61,61) 78.9%);",
  "background-image": "",
  "background-repeat": "",
  "background-attachment": "",
  "background-blend-mode": ""
}
```

The `"color"` field uses `__SCHEME__` prefix tokens that name semantic color slots:
- `__SCHEME__background_primary` — the scheme's primary section background
- `__SCHEME__background_secondary` — lighter secondary background
- `__SCHEME__body_background` — page body background (white for default scheme)
- `__SCHEME__brand_primary` — the brand accent color
- `__SCHEME__foreground_primary` — primary text color

Each color scheme (SCHEME_1 through SCHEME_N) defines what each semantic slot resolves to.
The active default scheme (SCHEME_1 "Light") resolves:
- `background_primary` → `rgba(255, 255, 255, 1)` (white)
- `body_background` → `rgba(255, 255, 255, 1)` (white)
- `brand_primary` → `rgba(25, 92, 91, 1)` (dark teal)

**Stage 2 — PHP Parser (`color.php`) converts `__SCHEME__` tokens to CSS variable references**

```php
// Color::parseValue() in color.php:
"__SCHEME__background_primary" →
  "hsla(var(--j-color-scheme-background-primary-h),
        var(--j-color-scheme-background-primary-s),
        calc(var(--j-color-scheme-background-primary-l) - 0%),
        calc(var(--j-color-scheme-background-primary-a) * 1))"
```

The conversion uses `Option::varName('color-scheme', 'background_primary')`:
```php
public static function varName($type, $value) {
    return '--j-' . $type . '-' . Str::handleize($value);
    // handleize: underscores→hyphens, lowercase
}
// Result: "--j-color-scheme-background-primary"
```

This CSS variable string is what the storefront API returns as `row.background['background-color']`.

**Stage 3 — Skin controller (`skin.php`) generates the CSS variable stylesheet**

For each color scheme, it converts each semantic color from RGBA → HSL and outputs CSS:

```php
// Simplified:
foreach ($color_schemes as $scheme_id => $colors) {
    $mode = 'color-scheme-' . handleize($scheme_id);  // e.g. "color-scheme-scheme-3"
    foreach ($colors as $slot_name => $rgba_color) {
        $hsl = RGBAtoHSL($rgba_color);
        $var = '--j-color-scheme-' . handleize($slot_name);
        // Outputs:  --j-color-scheme-background-primary-h: 0
        //           --j-color-scheme-background-primary-s: 0%
        //           --j-color-scheme-background-primary-l: 100%
        //           --j-color-scheme-background-primary-a: 1
    }
    // Default scheme gets :root scope; others get .<class-name> scope
    if ($mode === $active_skin_color_scheme) {
        css_output(":root, .color-scheme-scheme-1 { ... }")
    } else {
        css_output(".color-scheme-scheme-3 { ... }")
    }
}
```

**Stage 4 — Browser evaluates CSS variables**

When a row has `class="grid-row color-scheme-scheme-3"`, the browser switches variable resolution to the `.color-scheme-scheme-3` scope. The `hsla(var(--j-color-scheme-background-primary-h), ...)` value is then computed using scheme-3's HSL values, yielding scheme-3's warm surface color.

---

### The API Data We Receive

The storefront API response has **already run Stage 2** — the `__SCHEME__` tokens have been converted to `hsla(var(...))` strings. We only see the already-parsed CSS variable references, not the original tokens.

From the live `common/home` response (7 rows):

| Row | `color_scheme` | `background-color` pattern |
|---|---|---|
| 1 (slider) | `""` (empty) | `--j-color-scheme-body-background-*` |
| 2 | `""` | `--j-color-scheme-body-background-*` |
| 3 | `"color-scheme-scheme-3"` | `--j-color-scheme-background-primary-*` |
| 4 | `""` | `--j-color-scheme-body-background-*` |
| 5 | `"color-scheme-scheme-3"` | `--j-color-scheme-background-primary-*` |
| 6 | `""` | `--j-color-scheme-body-background-*` |
| 7 | `""` | `--j-color-scheme-body-background-*` |

Row 1 also has a `gradient` field:
```
"gradient": "background-image: linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%);"
```

---

### The Decoding Key for React Native

Because we can't evaluate CSS variables in RN, we map the variable name to a concrete color:

| CSS variable pattern in `background-color` | `row.color_scheme` | RN color to use |
|---|---|---|
| contains `body-background` | any | `DEFAULT_SCHEME.surface` (white) |
| contains `background-primary` | `""` or unknown | `DEFAULT_SCHEME.surface` (white) |
| contains `background-primary` | `"color-scheme-scheme-3"` | `SCHEMES['color-scheme-scheme-3'].surface` (`#EFE7E0`) |
| contains `background-secondary` | any | `getColorScheme(row.color_scheme).surface` with slight darken |
| contains anything else | any | transparent (no background) |

The `color_scheme` on the row is always the decisive signal. The CSS variable name in `background-color` only tells us **which semantic slot** — `body-background` and `background-primary` both resolve to `surface` for the purposes of RN (they're both white for the default scheme, and the scheme's surface color when a scheme is active).

---

## Implementation Plan

### Phase 1 — `src/utils/resolveRowBackground.js` (NEW FILE)

**Purpose:** Given `row.background` + `row.color_scheme`, return concrete RN-usable style.

```js
// Input:  backgroundObj (row.background), colorSchemeKey (row.color_scheme)
// Output: { backgroundColor: string|null, gradient: object|null }

function resolveRowBackground(backgroundObj, colorSchemeKey) {
  const scheme = getColorScheme(colorSchemeKey);  // from existing colorSchemes.js

  // 1. Resolve backgroundColor
  const bgColorStr = backgroundObj?.['background-color'] ?? '';
  let backgroundColor = null;

  if (bgColorStr.includes('--j-color-scheme-background-primary') ||
      bgColorStr.includes('--j-color-scheme-body-background')) {
    // Both map to the scheme's surface color.
    // When no color_scheme is set, getColorScheme('') returns DEFAULT_SCHEME (near-white).
    // When a scheme is set, we get that scheme's surface.
    backgroundColor = scheme.surface;
  } else if (bgColorStr.startsWith('rgba') || bgColorStr.startsWith('rgb') || bgColorStr.startsWith('#')) {
    // Concrete color value — use directly (future-proof for custom rows)
    backgroundColor = bgColorStr;
  }
  // Otherwise null (transparent / no background change)

  // 2. Parse gradient
  const gradientStr = backgroundObj?.gradient ?? '';
  let gradient = null;

  if (gradientStr.includes('linear-gradient')) {
    gradient = parseLinearGradient(gradientStr);
  }

  return { backgroundColor, gradient };
}
```

**Gradient parser** — input: full CSS string with `background-image:` prefix:
```
"background-image: linear-gradient(109.6deg, rgba(0, 0, 0, 0.93) 11.2%, rgb(63, 61, 61) 78.9%);"
```

Steps:
1. Strip `background-image:` prefix and `;` suffix, trim
2. Match `linear-gradient(ANGLE, ...STOPS)`
3. Parse angle: `109.6deg` → `109.6`
4. Parse each stop: `rgba(0, 0, 0, 0.93) 11.2%` → `{color: 'rgba(0,0,0,0.93)', location: 0.112}`
5. Return `{ angle: 109.6, colors: string[], locations: number[] }` — the exact shape `expo-linear-gradient` needs

---

### Phase 2 — Add `expo-linear-gradient` (if not installed)

```
grep "linear-gradient" package.json
```

If absent: `npx expo install expo-linear-gradient`

Fallback when gradient package is missing: use the solid `backgroundColor` only.

---

### Phase 3 — `src/components/common/RowContainer.js` (NEW FILE)

A lightweight wrapper applied per-row. Props:

```js
// backgroundColor: string|null — solid background
// gradient: {angle, colors, locations}|null — overlay gradient
// isFullWidth: boolean — whether row breaks out of parent horizontal padding
// paddingH: number — the parent's horizontal padding to cancel for full-width rows (default 14)
// children
```

Rendering logic:

```jsx
function RowContainer({ backgroundColor, gradient, isFullWidth, paddingH = 14, children }) {
  const containerStyle = [
    backgroundColor ? { backgroundColor } : null,
    isFullWidth ? { marginHorizontal: -paddingH } : null,
  ];

  const content = (
    <View style={containerStyle}>
      {/* re-apply horizontal padding inside full-width rows so modules are contained */}
      <View style={isFullWidth ? { paddingHorizontal: paddingH } : null}>
        {children}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={gradient.colors}
        locations={gradient.locations}
        start={{ x: 0, y: 0 }}
        end={angleToVector(gradient.angle)}
        style={containerStyle}
      >
        <View style={isFullWidth ? { paddingHorizontal: paddingH } : null}>
          {children}
        </View>
      </LinearGradient>
    );
  }

  return content;
}
```

Helper: `angleToVector(degrees)` converts a CSS gradient angle to an `{x, y}` vector for `expo-linear-gradient`:
```js
// CSS gradient angle: 0deg = bottom→top, 90deg = left→right, 180deg = top→bottom
// expo-linear-gradient: start/end are {x, y} in 0..1 space
function angleToVector(angleDeg) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: 0.5 + 0.5 * Math.cos(rad), y: 0.5 + 0.5 * Math.sin(rad) };
}
```

---

### Phase 4 — Rebuild `renderSection` in `HomeScreen.js`

**Current structure** (flat, ignores all row-level styling):
```jsx
// All rows' modules are rendered flat inside a single paddingHorizontal={14} View
return Object.keys(sectionRows).map(key => {
  const row = sectionRows[key];
  return Object.keys(row.columns).map(colKey => {
    // items...
    return <View key={id} marginTop={10}><ModuleComponent ... /></View>
  });
});
```

**New structure** (each row gets its own styled container):
```jsx
const HORIZONTAL_PADDING = 14;

return Object.keys(sectionRows).map(rowKey => {
  const row = sectionRows[rowKey];
  const rowStyle = resolveRowBackground(row.background, row.color_scheme);
  const isFullWidth = !!(row.classes?.['fullwidth-row']);
  const rowScheme = row.color_scheme || null;

  const modules = Object.keys(row.columns).flatMap(colKey => {
    const col = row.columns[colKey];
    const colScheme = col.color_scheme || rowScheme;  // column inherits from row

    return Object.keys(col.items).map(itemKey => {
      const item = col.items[itemKey];
      const ModuleComponent = componentMap[item.item.type];
      return ModuleComponent ? (
        <View key={item.item.id} marginTop={10}>
          <ModuleComponent
            data={item.item.data.items || []}
            options={item.item.data}
            rowScheme={colScheme}
          />
        </View>
      ) : null;
    });
  });

  return (
    <RowContainer
      key={rowKey}
      backgroundColor={rowStyle.backgroundColor}
      gradient={rowStyle.gradient}
      isFullWidth={isFullWidth}
      paddingH={HORIZONTAL_PADDING}
    >
      {modules}
    </RowContainer>
  );
});
```

Also: remove the outer `paddingHorizontal={14}` from the `<ScrollView>`'s inner `<View>` — RowContainer now handles this per-row. Full-width rows bleed edge-to-edge; contained rows re-apply the 14px internally.

---

### Phase 5 — Row Scheme Inheritance in Modules

Modules currently call `getColorScheme(options.color_scheme)`. When a module has no own scheme, it should inherit the row's scheme via the new `rowScheme` prop.

**Pattern to apply to every module that calls `getColorScheme`:**
```js
// Before
const scheme = getColorScheme(options.color_scheme);

// After
const scheme = getColorScheme(options.color_scheme || props.rowScheme);
```

Modules to update:
- `src/modules/Title.js`
- `src/modules/Products.js`
- `src/modules/InfoBlocks.js`
- `src/modules/BlogPosts.js`
- `src/modules/Gallery.js`
- `src/modules/category.js`
- `src/modules/MasterSlider.js`

---

### Phase 6 — `storefront.js` (no changes needed)

The row objects in `layout.top.rows` already contain `background`, `color_scheme`, `classes` — these are preserved by `getHomeLayout()`. The `background` values are pre-parsed CSS strings (Stage 2 output from the PHP parser).

---

## File Summary

| File | Action | Phase |
|---|---|---|
| `src/utils/resolveRowBackground.js` | CREATE — background resolver + gradient parser | 1 |
| `package.json` | Maybe ADD `expo-linear-gradient` | 2 |
| `src/components/common/RowContainer.js` | CREATE — styled row wrapper with gradient support | 3 |
| `src/Tabs/Home/HomeScreen.js` | MODIFY — rebuild `renderSection`, row-per-container, thread `rowScheme` | 4 |
| `src/modules/Title.js` | MODIFY — add `rowScheme` fallback | 5 |
| `src/modules/Products.js` | MODIFY — add `rowScheme` fallback | 5 |
| `src/modules/InfoBlocks.js` | MODIFY — add `rowScheme` fallback | 5 |
| `src/modules/BlogPosts.js` | MODIFY — add `rowScheme` fallback | 5 |
| `src/modules/Gallery.js` | MODIFY — add `rowScheme` fallback | 5 |
| `src/modules/category.js` | MODIFY — add `rowScheme` fallback | 5 |
| `src/modules/MasterSlider.js` | MODIFY — add `rowScheme` fallback | 5 |
| `src/components/common/colorSchemes.js` | NO CHANGE (already correct) | — |
| `src/api/storefront.js` | NO CHANGE (row data preserved, background already pre-parsed) | — |

---

## What the Live Data Will Look Like After Implementation

Based on the 7 rows in the live `common/home` response:

| Row | Module | `color_scheme` | Effect |
|---|---|---|---|
| 1 | Slider | `""` | white bg; black gradient overlay on top |
| 2 | Banners | `""` | white bg |
| 3 | Products | `"color-scheme-scheme-3"` | `#EFE7E0` warm beige bg; full-width |
| 4 | Categories | `""` | white bg; full-width |
| 5 | InfoBlocks | `"color-scheme-scheme-3"` | `#EFE7E0` warm beige bg |
| 6 | Testimonials | `""` | white bg; full-width |
| 7 | BlogPosts | `""` | white bg; full-width |

---

## What Is NOT Attempted (Out of Scope)

- **Video row backgrounds** — `videoBgStatus`, `videoBg` (no live rows use these)
- **Wave decorations** — `waveStatus`, `waveDirection` (all false in live data)
- **Parallax** — `background-attachment: fixed` (not in live data)
- **Custom background images** — `background-image` field (empty in live data)
- **Overlay blending** — `overlayStatus`, `background-blend-mode` (not in live data)
- **CSS variable endpoint** — The backend does not expose a theme-settings API; all color values are hardcoded in `colorSchemes.js` (the existing 4-scheme palette is correct)

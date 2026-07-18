import { getColorScheme } from '../components/common/colorSchemes';

/**
 * Resolves a Journal3 row's background object to a concrete React Native color.
 *
 * The backend stores background-color as hsla(var(--j-color-scheme-*-h), ...) —
 * CSS variable references the browser evaluates at runtime against the active color
 * scheme. In RN we have no CSS engine, so we detect the variable family name and
 * map it to our palette instead.
 *
 * Two variable families appear in live data:
 *   --j-color-scheme-background-primary-*  →  scheme's surface color
 *   --j-color-scheme-body-background-*     →  default surface (getColorScheme('') = white)
 *
 * Both cases resolve to getColorScheme(colorSchemeKey).surface, which naturally
 * handles both: passing an active scheme key gives that scheme's surface; passing
 * empty / unknown falls back to DEFAULT_SCHEME (near-white).
 *
 * @param {object|null} backgroundObj  - row.background from the layout API
 * @param {string}      colorSchemeKey - row.color_scheme (e.g. "color-scheme-scheme-3")
 * @returns {{ backgroundColor: string|null }}
 *   backgroundColor is null when the row has no resolvable background
 *   (caller should fall back to scheme.surface or transparent).
 */
export function resolveRowBackground(backgroundObj, colorSchemeKey) {
  if (!backgroundObj) return { backgroundColor: null };

  const bgColorStr = backgroundObj['background-color'] ?? '';

  // CSS variable reference → resolve against the scheme palette
  if (
    bgColorStr.includes('--j-color-scheme-background-primary') ||
    bgColorStr.includes('--j-color-scheme-body-background')
  ) {
    return { backgroundColor: getColorScheme(colorSchemeKey).surface };
  }

  // Concrete color value (future-proof: custom row background set by admin)
  if (/^rgba?\(|^#/.test(bgColorStr.trim())) {
    return { backgroundColor: bgColorStr.trim() };
  }

  return { backgroundColor: null };
}

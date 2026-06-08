// Journal3 modules carry a per-item/per-module `color_scheme` field
// (e.g. "color-scheme-scheme-4"). The web theme resolves these from the tenant's
// CSS variable set. In RN we map the four standard scheme keys to palette objects.
//
// MULTI-TENANT NOTE: These are fallback defaults. A real tenant config (fetched
// from the storefront API or a theme-config endpoint) may supply its own palette
// for each scheme key. When that config arrives, replace or extend SCHEMES at
// app-init time rather than hardcoding colors here.

const SCHEMES = {
  'color-scheme-scheme-1': {
    surface: '#ECE7DD',
    accent: '#1F726B',
    text: '#2B2B2B',
    muted: '#8A8378',
  },
  'color-scheme-scheme-2': {
    surface: '#E7EAEC',
    accent: '#2C5F7C',
    text: '#26323A',
    muted: '#7C8A92',
  },
  'color-scheme-scheme-3': {
    surface: '#EFE7E0',
    accent: '#B5623A',
    text: '#3A2C24',
    muted: '#9C8576',
  },
  'color-scheme-scheme-4': {
    surface: '#ECE7DD',
    accent: '#1F726B',
    text: '#2B2B2B',
    muted: '#8A8378',
  },
};

const DEFAULT_SCHEME = {
  surface: '#F5F5F5',
  accent: '#1F726B',
  text: '#2B2B2B',
  muted: '#888888',
};

export const getColorScheme = (name) => SCHEMES[name] || DEFAULT_SCHEME;

// Allow runtime tenant config to inject its palette at startup.
export const registerTenantSchemes = (tenantSchemes) => {
  Object.assign(SCHEMES, tenantSchemes);
};

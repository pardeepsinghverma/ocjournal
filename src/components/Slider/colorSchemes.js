// Journal3 slides carry a per-slide `color_scheme` (e.g. "color-scheme-scheme-4").
// The web theme resolves these to a background/accent/text palette. We don't get
// the raw CSS variables over the Storefront API, so we map the four demo schemes
// to tasteful palettes derived from the web reference (cream surface + teal accent
// for the default scheme, with distinct accents per scheme).
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

const DEFAULT_SCHEME = SCHEMES['color-scheme-scheme-4'];

export const getColorScheme = (name) => SCHEMES[name] || DEFAULT_SCHEME;

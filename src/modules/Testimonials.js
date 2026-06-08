import React from 'react';
import { getPlaceholderImage } from '../utils/getImage';
import { getColorScheme } from '../components/common/colorSchemes';
import TestimonialsView from '../components/Testimonials/TestimonialsView';

// The demo backend serves localhost placeholder images that won't load on a
// device. Only trust a URL if it looks like a real remote asset.
const isRealImage = (src) =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  /^https?:\/\//i.test(src) &&
  !/localhost|127\.0\.0\.1/i.test(src) &&
  !/placeholder/i.test(src) &&
  !/null|undefined/i.test(src);

// Strips leading punctuation / whitespace ("- charlibaltimore" → "charlibaltimore").
const cleanAuthor = (raw) => (raw ? String(raw).replace(/^[\s\-–—]+/, '') : '');

/**
 * Normalises one raw item from the keyed-object payload into the clean view-model
 * that TestimonialCard consumes.
 *
 * Schema fields used:
 *   item.content        — quote body (may contain HTML in other tenants)
 *   item.footerText     — author handle, prefixed with "- "
 *   item.title          — optional role / company (null in demo)
 *   item.image          — avatar URL (localhost placeholder in demo)
 *   item.id             — stable React key
 *   item.index          — fallback key
 */
const parseCard = (item) => ({
  id: item.id || String(item.index || Math.random()),
  content: item.content || '',
  author: cleanAuthor(item.footerText || ''),
  role: item.title || '',
  // No numeric rating in this schema version — omit the star row by leaving null.
  rating: null,
  avatarUri: isRealImage(item.image)
    ? item.image
    : getPlaceholderImage(null, 44, 44, ''),
});

/**
 * Layout module: `testimonials` (customer review carousel).
 *
 * HomeScreen calls:
 *   <Testimonials data={item.item.data.items || []} options={item.item.data} />
 *
 * `data`    = item.item.data.items  — keyed object {"1":{...},"2":{...}}
 * `options` = item.item.data        — full config object
 */
const Testimonials = ({ data, options = {} }) => {
  // Respect module visibility toggle.
  if (options.status === false) return null;

  // Normalize keyed object → array (NEVER call .map on a keyed object directly).
  const rawList = Array.isArray(data) ? data : Object.values(data || {});
  const cards = rawList
    .filter((item) => item && item.content)
    .map(parseCard);

  if (!cards.length) return null;

  // Derive carousel settings from options — multi-tenant, never hardcoded.
  const carouselOpts = options.carouselOptions || {};
  const autoplayObj = carouselOpts.autoplay;
  const autoplayDelay =
    typeof autoplayObj === 'object' && autoplayObj !== null
      ? autoplayObj.delay || 3000
      : 3000;

  // itemsPerRow.sc[0].items = items per row on phone ("sc" = small column).
  const scRow = options.itemsPerRow && options.itemsPerRow.sc;
  const itemsPerPage =
    Array.isArray(scRow) && scRow[0] ? scRow[0].items || 1 : 1;

  const settings = {
    // Use carousel mode when options.carousel is true (the typical case).
    carousel: options.carousel !== false,
    loop: !!(carouselOpts.loop),
    autoplay: !!(autoplayObj),
    autoplayDelay,
    speed: carouselOpts.speed || 500,
    itemsPerPage,
    moduleTitle: options.title || options.moduleTitle || '',
  };

  // Module-level color scheme applied to section title text color.
  const moduleScheme = getColorScheme(options.color_scheme_module);

  return (
    <TestimonialsView
      cards={cards}
      settings={settings}
      moduleScheme={moduleScheme}
    />
  );
};

export default Testimonials;

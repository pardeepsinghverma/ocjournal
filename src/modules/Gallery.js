import React from 'react';
import { getPlaceholderImage } from '../utils/getImage';
import GalleryView from '../components/Gallery/GalleryView';

/**
 * Gallery module entry.
 *
 * HomeScreen calls:
 *   <Gallery data={item.item.data.items || []} options={item.item.data} />
 *
 * `data`    — the items keyed object {"1":{...},"18":{...}}  (or [] if empty)
 * `options` — the full data config object
 *
 * Schema source: api-demo/modules/gallery/schema.txt
 */

// Only trust image URLs that are real remote assets, not localhost or placeholders
const isRealImage = (src) =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  /^https?:\/\//i.test(src) &&
  !/localhost|127\.0\.0\.1/i.test(src) &&
  !/placeholder/i.test(src);

/**
 * Resolve a thumb/popup URL: real remote → use it; anything else → placehold.co.
 */
const resolveImageUri = (src, width, height, label) =>
  isRealImage(src) ? src : getPlaceholderImage(src, width, height, label);

/**
 * Derive phone-appropriate column count from options.itemsPerRow.
 * Journal3 breakpoint keys:
 *   c0 = desktop (≥1200px), c1 = laptop, c2 = tablet, sc = small (phone)
 * We use `sc` for mobile, falling back to `c0`.
 */
const deriveCols = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 3;
  const sc = itemsPerRow.sc;
  if (Array.isArray(sc) && sc.length > 0 && sc[0] && sc[0].items > 0) {
    return sc[0].items;
  }
  const c0 = itemsPerRow.c0;
  if (Array.isArray(c0) && c0.length > 0 && c0[0] && c0[0].items > 0) {
    return c0[0].items;
  }
  return 3;
};

/**
 * Derive spacing (gap) for the phone breakpoint.
 */
const deriveGap = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 8;
  const sc = itemsPerRow.sc;
  if (Array.isArray(sc) && sc.length > 0 && sc[0]) {
    const spacing = sc[0].spacing;
    // spacing === 0 means "no gap" per Journal3 convention — use 4 so cells don't
    // bleed into each other visually on a real device.
    return typeof spacing === 'number' && spacing > 0 ? spacing : 4;
  }
  return 8;
};

/**
 * Map a raw items keyed-object item to the view-model GalleryItem expects.
 */
const parseItem = (raw, thumbW, thumbH) => {
  if (!raw || typeof raw !== 'object') return null;

  const thumbUri = resolveImageUri(
    raw.thumb || raw.thumb2x,
    thumbW,
    thumbH,
    raw.alt || raw.title || 'Gallery',
  );
  const popupUri = resolveImageUri(
    raw.popup || raw.popup2x,
    thumbW * 4,
    thumbH * 4,
    raw.alt || raw.title || 'Gallery',
  );
  const popupThumbUri = resolveImageUri(
    raw.popupThumb,
    90,
    90,
    raw.alt || 'Gallery',
  );

  return {
    id: raw.id || String(raw.index || ''),
    type: raw.type || 'image',    // "image" | "video" | "link"
    videoType: raw.videoType || 'html5',
    title: raw.title || raw.alt || '',
    alt: raw.alt || raw.title || '',
    thumbUri,
    popupUri,
    popupThumbUri,
    link: raw.link || null,
    index: raw.index || 0,
  };
};

const Gallery = ({ data, options = {} }) => {
  // Respect module status flag
  if (options?.status === false) return null;

  // Normalize keyed-object → array (THE critical safety step)
  const rawList = Array.isArray(data)
    ? data
    : Object.values(data || {});

  // Thumb dimensions from options; square fallback
  const thumbW = options?.thumbDimensions?.width || 160;
  const thumbH = options?.thumbDimensions?.height || 160;

  // Map raw items to view-model; drop any that fail to parse
  const items = rawList
    .map((raw) => parseItem(raw, thumbW, thumbH))
    .filter(Boolean);

  if (items.length === 0) return null;

  // Derive grid settings from options (never hardcode)
  const itemsPerRow = options?.itemsPerRow;
  const cols = deriveCols(itemsPerRow);
  const gap = deriveGap(itemsPerRow);

  const carouselOptions = options?.carouselOptions || {};

  const settings = {
    cols,
    gap,
    carousel: !!options?.carousel,
    autoplay: !!carouselOptions.autoplay,
    loop: !!carouselOptions.loop,
    speed: carouselOptions.speed || 500,
  };

  return <GalleryView items={items} settings={settings} />;
};

export default Gallery;

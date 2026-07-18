import React from 'react';
import { getPlaceholderImage } from '../utils/getImage';
import CategoriesView from '../components/Categories/CategoriesView';

// Reject localhost / placeholder image URLs — the demo backend returns these.
const isRealImage = (src) =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  /^https?:\/\//i.test(src) &&
  !/localhost|127\.0\.0\.1/i.test(src) &&
  !/placeholder/i.test(src) &&
  !/null|undefined/i.test(src);

/**
 * Resolve the best image URI for a category.
 * Prefers thumb2x (higher-res), falls back to thumb, falls back to placeholder.
 */
const resolveCategoryImage = (cat, imgW, imgH) => {
  const src = cat.thumb2x || cat.thumb;
  if (isRealImage(src)) return src;
  return getPlaceholderImage(null, imgW, imgH, cat.name || 'Category');
};

/**
 * Derive phone-appropriate column count from options.itemsPerRow.
 *
 * Journal3 breakpoint keys:
 *   sc  = small/phone (array form: [{ items, spacing }])  ← preferred on mobile
 *   c0  = desktop column 0 (breakpoint-object: { "0":{...}, "500":{...}, ... })
 *   c1, c2 = wider column tiers (same breakpoint-object form)
 *
 * API value for categories: sc[0].items = 1 (single column on phone).
 *
 * Strategy:
 *   1. Read sc[0].items directly — sc is always array form per Journal3 spec.
 *   2. Fall back to c0 breakpoint object: pick largest key <= 430 px.
 *   3. Hard fallback: 2 columns.
 */
const mobileColumns = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 2;

  // 1. Prefer sc (small/phone) — always array form.
  const sc = itemsPerRow.sc;
  if (Array.isArray(sc) && sc.length > 0 && sc[0] && typeof sc[0].items === 'number') {
    return Math.max(1, sc[0].items);
  }

  // 2. Fall back to c0 breakpoint-object: largest key <= 430 px.
  const c0 = itemsPerRow.c0;
  if (!c0 || typeof c0 !== 'object') return 2;
  const PHONE_WIDTH = 430;
  const keys = Object.keys(c0)
    .map(Number)
    .filter((k) => !Number.isNaN(k))
    .sort((a, b) => a - b);
  let chosen = keys[0] !== undefined ? String(keys[0]) : null;
  for (const k of keys) {
    if (k <= PHONE_WIDTH) chosen = String(k);
    else break;
  }
  const entry = chosen !== null ? c0[chosen] : null;
  if (entry && typeof entry.items === 'number') return Math.max(1, entry.items);
  return 2;
};

/**
 * Derive phone-appropriate gap size from options.itemsPerRow.
 *
 * Mirrors mobileColumns: prefers sc[0].spacing, then c0 breakpoint-object.
 * API value for categories: sc[0].spacing = 20.
 * Hard fallback: 12 px.
 */
const mobileGap = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 12;

  // 1. Prefer sc (small/phone) — always array form.
  const sc = itemsPerRow.sc;
  if (Array.isArray(sc) && sc.length > 0 && sc[0] && typeof sc[0].spacing === 'number') {
    return sc[0].spacing;
  }

  // 2. Fall back to c0 breakpoint-object.
  const c0 = itemsPerRow.c0;
  if (!c0) return 12;
  const PHONE_WIDTH = 430;
  const keys = Object.keys(c0)
    .map(Number)
    .filter((k) => !Number.isNaN(k))
    .sort((a, b) => a - b);
  let chosen = keys[0] !== undefined ? String(keys[0]) : null;
  for (const k of keys) {
    if (k <= PHONE_WIDTH) chosen = String(k);
    else break;
  }
  const entry = chosen !== null ? c0[chosen] : null;
  if (entry && typeof entry.spacing === 'number') return entry.spacing;
  return 12;
};

/**
 * Flatten all categories out of all tab-items in the keyed data object.
 * data = { "1": { categories: { "451": {...}, ... } }, ... }
 */
const extractCategories = (data, imgW, imgH) => {
  // data may be an array (passed as [] when empty) or a keyed object
  const tabItems = Array.isArray(data) ? data : Object.values(data || {});

  const out = [];
  tabItems.forEach((tabItem) => {
    if (!tabItem || !tabItem.categories) return;
    const cats = Object.values(tabItem.categories);
    cats.forEach((cat) => {
      if (!cat || !cat.category_id) return;
      out.push({
        categoryId: cat.category_id,
        name: cat.name || '',
        description: cat.description || '',
        total: cat.total != null ? String(cat.total) : '0',
        imageUri: resolveCategoryImage(cat, imgW, imgH),
        href: cat.href || '',
      });
    });
  });
  return out;
};

const Category = ({ data, options = {} }) => {
  // Respect status flag — some tenants disable the module entirely
  if (options.status === false) return null;

  const imgW = options.image_width || options.imageDimensions?.width || 300;
  const imgH = options.image_height || options.imageDimensions?.height || 300;

  // Normalize data (may arrive as keyed object or empty array)
  const categories = extractCategories(data, imgW, imgH);

  if (!categories.length) return null;

  // Derive columns and gap for the phone breakpoint.
  // mobileColumns() prefers itemsPerRow.sc[0].items (API value: 1 on phone).
  // mobileGap() prefers itemsPerRow.sc[0].spacing (API value: 20 on phone).
  const columns = mobileColumns(options.itemsPerRow);
  const gapSize = mobileGap(options.itemsPerRow);

  // Image ratio from configured dimensions
  const imageRatio = imgH > 0 && imgW > 0 ? imgH / imgW : 1;

  const settings = {
    columns,
    gapSize,
    imageRatio,
    moduleCategory: options.moduleCategory || 'LARGE',
    carousel: !!options.carousel,
    showCount: !!options.productsCount,
    countText: options.productsCountText || '%s Product(s)',
    // Only show description text for LARGE style cards
    showDescription: String(options.moduleCategory || '').toUpperCase() === 'LARGE',
    descLimit: parseInt(options.descLimit, 10) || 75,
    colorScheme: options.color_scheme_content || options.color_scheme || '',
  };

  return <CategoriesView categories={categories} settings={settings} />;
};

export default Category;

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
 * Parse the itemsPerRow config to pick a sensible mobile column count.
 *
 * itemsPerRow is structured as:
 *   { c0: { "0": { items: 4, spacing: 20 }, "500": {...}, ... }, c1: {...}, sc: [...] }
 *
 * For a phone in portrait (< 500 CSS px ≈ smallest breakpoint) we use the
 * c0["500"].items value — that is what Journal3 applies at 500-wide containers
 * (which maps approximately to phone portrait). If absent we fall back to
 * c0["0"].items, then 2.
 */
const mobileColumns = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 2;
  const c0 = itemsPerRow.c0;
  if (!c0 || typeof c0 !== 'object') return 2;
  // Try the 500-breakpoint entry first (closest to a phone width)
  const bp500 = c0['500'];
  if (bp500 && bp500.items) return Math.max(1, bp500.items);
  const bp0 = c0['0'];
  if (bp0 && bp0.items) return Math.max(1, bp0.items);
  return 2;
};

/**
 * Derive gap size in px from itemsPerRow config.
 */
const mobileGap = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 12;
  const c0 = itemsPerRow.c0;
  if (!c0) return 12;
  const bp500 = c0['500'];
  if (bp500 && bp500.spacing != null) return bp500.spacing;
  const bp0 = c0['0'];
  if (bp0 && bp0.spacing != null) return bp0.spacing;
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

  // Derive columns and gap for the mobile (phone portrait) breakpoint
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

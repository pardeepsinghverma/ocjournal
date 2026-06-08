import React from 'react';
import {
  gridColumnsFromStyle,
  CARD_GAP,
  USABLE_WIDTH,
} from '../components/Products/ProductsView';
import ProductsView from '../components/Products/ProductsView';

// ---------------------------------------------------------------------------
// Normalise a raw product object (from item.products[id]) into a clean view-
// model the card component consumes.
// ---------------------------------------------------------------------------
const parseProduct = (raw) => {
  if (!raw || typeof raw !== 'object') return null;
  return {
    id: raw.product_id || null,
    name: raw.name || '',
    image: raw.image || null,
    price: raw.price || null,
    // `special` is a raw price string like "336.040000000000" when present,
    // or null when there is no sale price.
    special: raw.special && String(raw.special).trim() !== '' ? raw.special : null,
    rating: typeof raw.rating === 'number' ? raw.rating : 0,
    reviews: typeof raw.reviews === 'number' ? raw.reviews : 0,
    manufacturer: raw.manufacturer || '',
    stockStatus: raw.stock_status || '',
    model: raw.model || '',
  };
};

// ---------------------------------------------------------------------------
// Normalise a single tab object (from options.items[key]).
// Returns { id, title, products[] } or null if the tab has no products.
// ---------------------------------------------------------------------------
const parseTab = (raw) => {
  if (!raw || typeof raw !== 'object') return null;

  // raw.products is a keyed object {"845":{...}, "846":{...}}
  const productsRaw =
    raw.products && typeof raw.products === 'object'
      ? Object.values(raw.products)
      : [];

  const products = productsRaw
    .map(parseProduct)
    .filter(Boolean);

  return {
    id: raw.id || null,
    title: raw.title || '',
    active: raw.active === true,
    products,
  };
};

// ---------------------------------------------------------------------------
// Products module entry
// HomeScreen calls: <Products data={item.item.data.items || []} options={item.item.data} />
// `data`    = options.items (keyed object or empty array when backend returns none)
// `options` = the full data object
// ---------------------------------------------------------------------------
const Products = ({ data, options = {} }) => {
  // Guard: module disabled by tenant config
  if (options.status === false) return null;

  // Normalise keyed-object to array (schema says items is always a keyed object,
  // but guard for the empty-array case the HomeScreen may supply).
  const rawTabs = Array.isArray(data)
    ? data
    : Object.values(data || {});

  // Parse each tab; discard tabs that have no products.
  const tabs = rawTabs
    .map(parseTab)
    .filter((t) => t && t.products.length > 0);

  if (tabs.length === 0) return null;

  // -------------------------------------------------------------------------
  // Derive layout settings from options (all tenant-variable, never hardcoded)
  // -------------------------------------------------------------------------
  const cols = gridColumnsFromStyle(options.autoGridStyle);
  const cardWidth = (USABLE_WIDTH - CARD_GAP * (cols - 1)) / cols;

  // Image dimensions from options, falling back to a square equal to cardWidth.
  const imageWidth = options.image_width || cardWidth;
  const imageHeight = options.image_height || imageWidth;
  // Scale image height proportionally to the actual card width.
  const scaledImageHeight = (imageHeight / imageWidth) * cardWidth;

  const showRating = options.moduleProductListRatingVisibility !== false;

  // Cart button: show when display is "both" or "button"
  const cartDisplay = options.moduleProductListCartDisplay || '';
  const showCartButton = cartDisplay === 'both' || cartDisplay === 'button';

  const cartLabel = options.button_cart || 'Add to Cart';

  const settings = {
    cols,
    cardWidth,
    imageHeight: scaledImageHeight,
    showRating,
    showCartButton,
    cartLabel,
  };

  return <ProductsView tabs={tabs} settings={settings} />;
};

export default Products;

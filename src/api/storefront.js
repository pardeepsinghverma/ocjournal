import apiRequest from './apiclient';
import { STOREFRONT_ROUTE, API_ENDPOINTS } from './const';
import { registerTenantSchemes } from '../components/common/colorSchemes';

// Maps Journal3 DB color-slot names → RN palette keys used by getColorScheme()
const SLOT_MAP = {
  background_primary:  'surface',
  body_background:     'body',
  foreground_primary:  'text',
  foreground_secondary:'muted',
  brand_primary:       'accent',
  button_background:   'buttonBg',
  button_foreground:   'buttonText',
  neutral_background:  'neutral',
};

/**
 * Converts _storefront.theme.color_schemes (hex strings keyed by slot name)
 * into RN palette objects and registers them so every module picks up the
 * merchant's actual Journal3 colors instead of the hardcoded fallbacks.
 */
function applyThemeFromStorefront(theme) {
  const raw = theme?.color_schemes;
  if (!raw) return;

  const rnSchemes = {};
  for (const [schemeName, slots] of Object.entries(raw)) {
    const palette = {};
    for (const [slot, hex] of Object.entries(slots)) {
      const key = SLOT_MAP[slot];
      if (key) palette[key] = hex;
    }
    if (Object.keys(palette).length > 0) rnSchemes[schemeName] = palette;
  }

  registerTenantSchemes(rnSchemes);
}

/**
 * Storefront product helpers for the brandwik OpenCart (Journal3) backend.
 *
 * IMPORTANT backend behaviour (verified against the live server):
 * The Storefront JSON API does NOT return a structured `products` array for
 * list pages — Journal3 renders the product list as a pre-rendered HTML string
 * (the product-collector in storefront_api.php does not engage for these
 * routes). The ONLY structured product data available is the single-product
 * endpoint (`product/product&product_id=`).
 *
 * So to list a category's products we:
 *   1. fetch `product/category&path={id}` (its `products` field is HTML),
 *   2. extract the product ids from that HTML,
 *   3. hydrate each id via the structured `product/product` endpoint.
 *
 * If the backend is ever fixed to return a real array, step 1 short-circuits
 * and we use it directly.
 *
 * See docs/Backend-API-Integration-Guide.md §4.3 / §7 for the full caveat.
 */

const route = name => `${STOREFRONT_ROUTE}${name}`;

/**
 * Fetch the live home-screen layout from the `common/home` Storefront route.
 *
 * The home layout engine (src/Tabs/Home/HomeScreen.js) only needs the
 * `_storefront.layout.{top,bottom}.rows` trees — this normalises the raw
 * response into exactly that, with safe empty-object fallbacks so the renderer
 * never crashes on a partial/failed payload.
 *
 * To point the app at a different backend later, change ONE thing:
 * `API_DOMAIN` in src/api/const.ts. Nothing in the screens needs to change.
 *
 * @returns {Promise<{top: object, bottom: object, header: any, raw: any, error: string|null}>}
 */
export const getHomeLayout = async () => {
  const { data, error } = await apiRequest({
    url: route(API_ENDPOINTS.COMMON_HOME),
  });

  if (error || !data) {
    return {
      top: {},
      bottom: {},
      header: null,
      raw: null,
      error: (typeof error === 'string' && error) || 'Failed to load home layout',
    };
  }

  const layout = (data._storefront && data._storefront.layout) || {};

  applyThemeFromStorefront(data._storefront?.theme);

  return {
    top: (layout.top && layout.top.rows) || {},
    bottom: (layout.bottom && layout.bottom.rows) || {},
    header: data.header || null,
    raw: data,
    error: null,
  };
};

// Pull unique product ids out of a Journal3-rendered product-list HTML string.
const extractProductIds = (html, limit) => {
  if (typeof html !== 'string') return [];
  const ids = [];
  const seen = new Set();
  const re = /product_id=(\d+)/g;
  let m;
  while ((m = re.exec(html)) !== null && ids.length < limit) {
    if (!seen.has(m[1])) {
      seen.add(m[1]);
      ids.push(m[1]);
    }
  }
  return ids;
};

// Map a `product/product` detail response to the card shape ProductGrid wants
// (productGrid.mapProducts reads: product_id, name, thumb, price, tax, special, labels).
const detailToCard = d => ({
  product_id: d.product_id,
  name: d.heading_title || d.name || '',
  thumb:
    (Array.isArray(d.images) && d.images[0] && (d.images[0].thumb || d.images[0].popup)) ||
    d.thumb ||
    '',
  price: d.price,
  // detail `tax` doubles as the strikethrough/RRP in the card grid
  tax: d.tax,
  special: d.special && d.special !== false ? d.special : false,
  labels: d.labels || {},
});

/**
 * Get structured products for a storefront category id.
 * @returns {Promise<Array>} array of product-card objects (possibly empty).
 */
export const getCategoryProducts = async (categoryId, { limit = 12 } = {}) => {
  if (!categoryId) return [];

  const { data, error } = await apiRequest({
    url: `${route(API_ENDPOINTS.PRODUCT_CATEGORY)}&path=${categoryId}`,
  });
  if (error || !data) return [];

  // Future-proof: backend already returns a structured array.
  if (Array.isArray(data.products) && data.products.length) {
    return data.products;
  }

  const ids = extractProductIds(data.products, limit);
  if (!ids.length) return [];

  const results = await Promise.all(
    ids.map(id =>
      apiRequest({ url: `${route(API_ENDPOINTS.PRODUCT)}&product_id=${id}` }),
    ),
  );

  return results
    .map(r => r.data)
    .filter(Boolean)
    .map(detailToCard);
};

/**
 * Fetch a single product by id.
 * Returns the raw product/product response (heading_title, description, images[],
 * price, special, tax, options[], reviews[], rating, model, sku, …).
 *
 * @param {string|number} productId
 * @returns {Promise<object|null>}
 */
export const getProduct = async (productId) => {
  if (!productId) return null;
  const { data, error } = await apiRequest({
    url: `${route(API_ENDPOINTS.PRODUCT)}&product_id=${productId}`,
  });
  return (error || !data) ? null : data;
};

/**
 * Search for products by keyword.
 * Journal3 renders search results as HTML just like category pages, so we use
 * the same HTML→ids→detail bridge as getCategoryProducts.
 *
 * @param {string} query
 * @param {{ limit?: number }} options
 * @returns {Promise<Array>} array of product-card objects
 */
export const searchProducts = async (query, { limit = 12 } = {}) => {
  if (!query || !query.trim()) return [];

  const { data, error } = await apiRequest({
    url: `${route(API_ENDPOINTS.PRODUCT_SEARCH)}&search=${encodeURIComponent(query.trim())}`,
  });
  if (error || !data) return [];

  // Future-proof: backend already returns a structured array.
  if (Array.isArray(data.products) && data.products.length) {
    return data.products;
  }

  const ids = extractProductIds(data.products, limit);
  if (!ids.length) return [];

  const results = await Promise.all(
    ids.map(id => apiRequest({ url: `${route(API_ENDPOINTS.PRODUCT)}&product_id=${id}` })),
  );
  return results.map(r => r.data).filter(Boolean).map(detailToCard);
};

export default { getCategoryProducts, getHomeLayout, getProduct, searchProducts };

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import ManufacturersView from '../components/Manufacturers/ManufacturersView';

/**
 * Manufacturers module entry.
 *
 * HomeScreen calls: <Manufacturers data={item.item.data.items || []} options={item.item.data} />
 *
 * DATA SHAPE
 * ----------
 * `data`    = options.items — a KEYED OBJECT of tab entries ({"1": {...}, ...}).
 *             Each tab carries a `manufacturers` keyed object:
 *               { manufacturer_id, thumb, thumb2x, name, href }
 *
 * `options` = the full data object. Relevant fields:
 *   status            boolean — false → render nothing
 *   carousel          boolean — true → carousel paging; false → free-scroll
 *   carouselOptions   { autoplay, loop, speed }
 *   imageDimensions   { width, height }
 *   itemsPerRow       { sc: [{ items, spacing }] }  (sc = small/phone breakpoint)
 *   color_scheme_content  string (optional, e.g. "color-scheme-scheme-1")
 */

// Collect all manufacturers from all tab entries.
// data is a keyed object {"1": {manufacturers: {"2": {...}, "3": {...}}}, ...}
const collectBrands = (data) => {
  const tabs = Array.isArray(data) ? data : Object.values(data || {});
  const out = [];
  for (const tab of tabs) {
    if (tab && tab.manufacturers && typeof tab.manufacturers === 'object') {
      out.push(...Object.values(tab.manufacturers));
    }
  }
  return out;
};

const Manufacturers = ({ data, options = {} }) => {
  // Hook must be called unconditionally (Rules of Hooks).
  const navigation = useNavigation();

  // Respect status flag — after hook call.
  if (options.status === false) { return null; }

  // Normalise raw brands from nested tab structure
  const rawBrands = collectBrands(data);
  if (!rawBrands.length) { return null; }

  // --- Settings derived from options (never hardcoded) ---
  const imageDims = options.imageDimensions || {};
  const imageWidth = Number(imageDims.width) || options.image_width || 80;
  const imageHeight = Number(imageDims.height) || options.image_height || 80;

  const carouselOpts = options.carouselOptions || {};
  const carousel = !!options.carousel;
  const autoplay = !!carouselOpts.autoplay;
  const loop = !!carouselOpts.loop;
  const speed = Number(carouselOpts.speed) || 500;

  // Phone (small-screen) items per row — fall back to 4 if unset
  const itemsPerRow = options.itemsPerRow || {};
  const scRow = Array.isArray(itemsPerRow.sc) ? itemsPerRow.sc[0] : null;
  // Use sc (small/phone) as the mobile breakpoint; default to a sensible 4
  const itemsPerPage = Number(scRow?.items) > 0 ? Number(scRow.items) : 4;

  const settings = {
    carousel,
    autoplay,
    loop,
    speed,
    itemsPerPage,
    imageWidth,
    imageHeight,
  };

  // Map raw brands to the clean view-model the presentational layer consumes.
  const brands = rawBrands.map((b) => {
    const manufacturerId = b.manufacturer_id ? String(b.manufacturer_id) : null;

    // Navigate to catalog filtered by this manufacturer.
    // The catalog screen accepts { manufacturerId } — if the route doesn't
    // support this param yet, the press is wired but the param is silently
    // ignored by the screen (graceful no-op).
    const onPress = manufacturerId
      ? () => {
          navigation.navigate('catalog', { manufacturerId });
        }
      : null;

    return {
      id: manufacturerId || String(b.name || Math.random()),
      name: b.name || '',
      // Prefer the 2x thumb for crisp display; fall back to 1x.
      imageUri: b.thumb2x || b.thumb || '',
      onPress,
    };
  });

  return <ManufacturersView brands={brands} settings={settings} />;
};

export default Manufacturers;

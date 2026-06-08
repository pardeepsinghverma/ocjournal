import React from 'react';
import { getPlaceholderImage } from '../utils/getImage';
import BannersView from '../components/Banners/BannersView';

// The demo backend serves localhost placeholder images that won't load on a
// device. Only trust an image URL that looks like a real, remote asset.
const isRealImage = (src) =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  /^https?:\/\//i.test(src) &&
  !/localhost|127\.0\.0\.1/i.test(src) &&
  !/placeholder/i.test(src) &&
  !/null|undefined/i.test(src);

// Map a raw API item (from the keyed-object) to a clean view-model object
// that BannerItem consumes.
const parseBanner = (raw, dims) => {
  const imgW = raw.image_width || dims.width || 435;
  const imgH = raw.image_height || dims.height || 435;
  const src = raw.image2x || raw.image;
  const imageUri = isRealImage(src)
    ? src
    : getPlaceholderImage(src, imgW, imgH, raw.title || 'Banner');

  return {
    id: raw.id || String(raw.index || Math.random()),
    colorScheme: raw.color_scheme || '',
    title: raw.title || '',
    title2: raw.title2 || '',
    title3: raw.title3 || '',
    alt: raw.alt || '',
    // text is an optional HTML field — may be null
    text: raw.text || null,
    link: raw.link || null,
    imageUri,
    imageWidth: imgW,
    imageHeight: imgH,
  };
};

// Banner — entry component.
// HomeScreen calls: <Banner data={item.item.data.items || []} options={item.item.data} />
// `data` is a keyed object {"1":{...},"2":{...}} — never call .map() directly.
const Banner = ({ data, options = {} }) => {
  // Guard: disabled module
  if (options.status === false) return null;

  // Normalize keyed object → array. HomeScreen passes `data.items || []` so
  // `data` may arrive as the keyed object OR as an empty array (when items
  // key is absent). We handle both.
  const rawList = Array.isArray(data) ? data : Object.values(data || {});
  if (rawList.length === 0) return null;

  // Module-level image dimensions (shared aspect ratio for all items).
  const dims = {
    width: options.imageDimensions?.width || options.width || 435,
    height: options.imageDimensions?.height || options.height || 435,
  };

  const banners = rawList.map((raw) => parseBanner(raw, dims));

  return <BannersView banners={banners} options={options} />;
};

export default Banner;

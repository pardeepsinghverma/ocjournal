import React from 'react';
import { getPlaceholderImage } from '../utils/getImage';
import Slider from '../components/Slider/Slider';

// Each slide is a stack of "layers". Text layers declare a `textContainerStyle`
// that the web theme maps to a visual role — we translate the ones the slider
// actually uses into simple kinds the renderer understands.
const TEXT_KIND = {
  MEDIA_LABEL_DIVIDER: 'label',
  SLIDER_MAIN_TEXT_LARGE_COPY: 'heading',
  MEDIA_PRICE: 'price',
  SLIDER_IMAGE_CAPTION: 'caption',
};

// The demo backend serves localhost placeholder images that won't load on a
// device, so we only trust an image URL if it looks like a real, remote asset.
const isRealImage = (src) =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  /^https?:\/\//i.test(src) &&
  !/localhost|127\.0\.0\.1/i.test(src) &&
  !/placeholder/i.test(src) &&
  !/null|undefined/i.test(src);

const extractHotspots = (layer) => {
  const out = [];
  for (let i = 1; i <= 3; i += 1) {
    if (layer[`hotspot${i}`]) {
      out.push({
        type: layer[`hotspot${i}Type`],
        product: layer[`hotspot${i}Product`],
        link: layer[`hotspot${i}Link`],
        content: layer[`hotspot${i}Content`],
      });
    }
  }
  return out;
};

const parseSlide = (slide, dims) => {
  const layers = slide.items ? Object.values(slide.items) : [];
  let image = null;
  const content = [];

  layers.forEach((layer) => {
    if (layer.type === 'image') {
      const src = layer.image2x || layer.image;
      image = {
        uri: isRealImage(src)
          ? src
          : getPlaceholderImage(src, dims.imageWidth, dims.imageHeight, 'Slider'),
        hotspots: extractHotspots(layer),
      };
    } else if (layer.type === 'text') {
      if (layer.text) {
        content.push({ kind: TEXT_KIND[layer.textContainerStyle] || 'text', html: layer.text });
      }
    } else if (layer.type === 'button') {
      const buttons = [];
      if (layer.button_1_text) {
        buttons.push({ text: layer.button_1_text, link: layer.button_1_link, variant: dims.button1Style });
      }
      if (layer.button_2_text) {
        buttons.push({ text: layer.button_2_text, link: layer.button_2_link, variant: dims.button2Style });
      }
      if (buttons.length) content.push({ kind: 'buttons', buttons });
    }
  });

  if (!image) {
    image = {
      uri: getPlaceholderImage(null, dims.imageWidth, dims.imageHeight, 'Slider'),
      hotspots: [],
    };
  }

  return {
    id: slide.id || String(slide.index),
    colorScheme: slide.color_scheme,
    link: slide.link,
    image,
    content,
  };
};

/**
 * MasterSlider — Journal3 full-width hero slider (types: master_slider, slider).
 *
 * HomeScreen calls:
 *   <MasterSlider data={item.item.data.items || []} options={item.item.data} />
 *
 * `data`    = keyed object of slide entries {"1":{...},"2":{...}} (or [] when empty)
 * `options` = full data config object
 *
 * Status guard: if options.status === false the module is disabled — render null.
 *
 * itemsPerRow does not apply to this module (it is always full-width).
 */
const MasterSlider = ({ data, options = {} }) => {
  // Guard: respect the module-level visibility flag (consistent with all other modules).
  if (options.status === false) return null;

  const layerDims = options.slidesLayersImageDimensions || {};
  const dims = {
    imageWidth: layerDims.width || options.width || 700,
    imageHeight: layerDims.height || 450,
    button1Style: options.button1Style || 'DEFAULT',
    button2Style: options.button2Style || 'OUTLINE_FILL',
  };

  const slides =
    data && typeof data === 'object'
      ? Object.values(data).map((slide) => parseSlide(slide, dims))
      : [];

  const settings = {
    loop: !!(options.loop || options.options?.loop),
    autoplay: !!options.autoplay,
    interval: 4000,
    speed: options.options?.speed || 550,
    imageRatio: dims.imageHeight / dims.imageWidth,
    hasButtons: slides.some((slide) => slide.content.some((layer) => layer.kind === 'buttons')),
  };

  return <Slider slides={slides} settings={settings} />;
};

export default MasterSlider;

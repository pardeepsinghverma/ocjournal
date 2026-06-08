import React from 'react';
import { getColorScheme } from '../components/common/colorSchemes';
import MarqueeView from '../components/Marquee/MarqueeView';

/**
 * Layout module: `marquee`
 *
 * HomeScreen calls: <Marquee data={item.item.data.items || []} options={item.item.data} />
 *   data    – keyed object {"1":{…},"2":{…}} of marquee items, each shaped:
 *               { type, title (may contain HTML), link, index, id, classes, items }
 *   options – the full data object carrying config:
 *               { status, speed, direction, separator, color_scheme_module, repeat, … }
 */
const Marquee = ({ data, options = {} }) => {
  // Guard: module disabled by admin.
  if (options.status === false) return null;

  // Normalize keyed-object → array (data.items is NEVER a plain array for this type).
  const rawList = Array.isArray(data) ? data : Object.values(data || {});

  if (!rawList.length) return null;

  // Map each raw item to the view-model the component consumes.
  const items = rawList.map((it) => ({
    id: String(it?.id ?? it?.index ?? Math.random()),
    title: it?.title || '',
    link: it?.link || null,
  }));

  // Derive display settings from options — all tenant-variable, never hardcoded.
  const speed = options.speed;          // px/s; MarqueeView falls back to 50
  const direction = options.direction;  // 'ltr' | 'rtl'; MarqueeView defaults to rtl
  const separator = options.separator;  // may be '', '|', '●', etc.; MarqueeView defaults to '●'

  // Color scheme: color_scheme_module is the module-level key.
  const scheme = getColorScheme(options.color_scheme_module || '');

  return (
    <MarqueeView
      items={items}
      speed={speed}
      direction={direction}
      separator={separator}
      scheme={scheme}
    />
  );
};

export default Marquee;

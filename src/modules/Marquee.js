import React from 'react';
import { getColorScheme } from '../components/common/colorSchemes';
import MarqueeView from '../components/Marquee/MarqueeView';
import { resolveRowBackground } from '../utils/resolveRowBackground';

/**
 * Layout module: `marquee`
 *
 * HomeScreen calls: <Marquee data={…} options={…} rowScheme rowBackground isFullWidth />
 *   data        – keyed object {"1":{…},"2":{…}} of marquee items, each shaped:
 *                   { type, title (may contain HTML), link, index, id, classes, items }
 *   options     – the full data object carrying config:
 *                   { status, speed, direction, separator, color_scheme_module, repeat, … }
 *   rowScheme   – row.color_scheme key (e.g. "color-scheme-scheme-3"), or null
 *   rowBackground – row.background object from the layout API, or null
 *   isFullWidth – true when the row has class "fullwidth-row" (strip bleeds to screen edges)
 */
const Marquee = ({ data, options = {}, rowScheme, rowBackground, isFullWidth }) => {
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

  // Color scheme: module-level key takes priority, falls back to the row's scheme.
  // This means a module with no own scheme inherits its row's visual identity.
  const schemeKey = options.color_scheme_module || rowScheme || '';
  const scheme = getColorScheme(schemeKey);

  // Background: resolve the row's background CSS variable reference to a concrete color.
  // resolveRowBackground maps "--j-color-scheme-background-primary-*" / "body-background-*"
  // to scheme.surface. Null means no special background (MarqueeView falls back to scheme.surface).
  const { backgroundColor } = resolveRowBackground(rowBackground, rowScheme);

  return (
    <MarqueeView
      items={items}
      speed={speed}
      direction={direction}
      separator={separator}
      scheme={scheme}
      backgroundColor={backgroundColor}
      isFullWidth={isFullWidth}
    />
  );
};

export default Marquee;

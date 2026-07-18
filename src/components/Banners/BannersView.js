import React, { memo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import BannerItem from './BannerItem';

// HomeScreen applies paddingHorizontal:14 on each side, so usable width = device - 28.
const USABLE_WIDTH = () => Dimensions.get('window').width - 28;

// Resolve items-per-row + spacing from Journal3 `itemsPerRow` config object.
//
// Journal3 layout context keys:
//   c0 = homepage / full-width container (no sidebars) — this is what the web
//        homepage always uses regardless of screen width. Use c0 for banners.
//   c1, c2 = 1 or 2 sidebar columns present
//   sc = narrow sidebar column (NOT a phone-size breakpoint)
//
// For banners the API returns c0: [{ items: 2, spacing: 20 }], meaning 2 per row
// in a full-width layout — which is what the web renders at any viewport.
// sc: [{ items: 1 }] only applies when the module is placed in a sidebar.
const resolveRowConfig = (itemsPerRow) => {
  const fallback = { items: 1, spacing: 10 };
  if (!itemsPerRow) return fallback;

  // Use c0 (full-width homepage context), then sc, then first key present.
  const candidate = itemsPerRow.c0 || itemsPerRow.sc || Object.values(itemsPerRow)[0];
  if (!candidate) return fallback;

  // c0 is a flat array [{ items, spacing }] for banners.
  if (Array.isArray(candidate)) {
    const cfg = candidate[0] || {};
    return {
      items: parseInt(cfg.items, 10) || 1,
      spacing: parseInt(cfg.spacing, 10) || 0,
    };
  }

  // Breakpoint object variant: numeric keys are max-width thresholds.
  if (typeof candidate === 'object') {
    const numericKeys = Object.keys(candidate)
      .map(Number)
      .filter((k) => k > 0)
      .sort((a, b) => a - b);
    const width = USABLE_WIDTH();
    for (const bp of numericKeys) {
      if (width <= bp) {
        const cfg = candidate[String(bp)] || {};
        return {
          items: parseInt(cfg.items, 10) || 1,
          spacing: parseInt(cfg.spacing, 10) || 0,
        };
      }
    }
    const dflt = candidate['0'] || {};
    return {
      items: parseInt(dflt.items, 10) || 1,
      spacing: parseInt(dflt.spacing, 10) || 0,
    };
  }

  return fallback;
};

// Compute bento (mosaic) layout for each banner item.
//
// The web uses item image_width ratios to assign column spans — an item whose
// image_width is 2× the smallest item gets span=2 (full row), while same-sized
// items get span=1. This produces the characteristic Journal3 bento grid where
// one wide banner fills an entire row above two half-width banners.
//
// Algorithm:
//   unitWidth = (usableWidth - spacing * (perRow - 1)) / perRow
//   minImgW   = min(image_width) across all items in this module
//   span      = clamp(round(item.image_width / minImgW), 1, perRow)
//   cardWidth = span * unitWidth + (span - 1) * spacing
//   cardHeight = cardWidth * (image_height / image_width)
//
// Example — Module 1 (Living/SALE/Decor), perRow=2, unitWidth=171px:
//   Living (480×240): span=2 → cardWidth=362px (full row)
//   SALE   (240×240): span=1 → cardWidth=171px
//   Decor  (240×240): span=1 → cardWidth=171px
const computeBentoItems = (banners, unitWidth, spacing, perRow) => {
  if (!banners.length) return [];

  // Find the smallest valid image width to use as the 1-column reference unit.
  const validWidths = banners.map(b => b.imageWidth).filter(w => w > 0);
  const minImgW = validWidths.length ? Math.min(...validWidths) : unitWidth;

  return banners.map((banner) => {
    const imgW = banner.imageWidth > 0 ? banner.imageWidth : minImgW;
    const imgH = banner.imageHeight > 0 ? banner.imageHeight : imgW;
    const span = Math.min(perRow, Math.max(1, Math.round(imgW / minImgW)));
    const cardWidth = Math.floor(span * unitWidth + (span - 1) * spacing);
    const cardHeight = Math.round(cardWidth * (imgH / imgW));
    return { ...banner, cardWidth, cardHeight };
  });
};

// BannersView — renders banners in a bento grid or horizontal carousel.
//
// Grid mode (carousel:false):
//   Each item's column span is derived from its image_width relative to the
//   smallest image in the module. Items with 2× the minimum width span 2
//   columns (full-row), matching the Journal3 web layout exactly.
//
// Carousel mode (carousel:true or swiper_carousel:true):
//   Items scroll horizontally; each item is rendered at full usable width.
const BannersView = memo(({ banners, options }) => {
  if (!banners || banners.length === 0) return null;

  const isCarousel = !!(options.carousel || options.swiper_carousel);
  const { items: perRow, spacing } = resolveRowConfig(options.itemsPerRow);

  const usableWidth = USABLE_WIDTH();
  const unitWidth = (usableWidth - spacing * (perRow - 1)) / perRow;

  const globalScheme = options.color_scheme || '';

  if (isCarousel) {
    // Carousel: all items are full-width, paged horizontally.
    // Bento span logic doesn't apply — the carousel pager controls visibility.
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.carouselContent, { gap: spacing }]}
      >
        {banners.map((banner) => {
          const imgW = banner.imageWidth || usableWidth;
          const imgH = banner.imageHeight || imgW;
          const cardHeight = Math.round(usableWidth * (imgH / imgW));
          return (
            <BannerItem
              key={banner.id}
              item={banner}
              cardWidth={usableWidth}
              cardHeight={cardHeight}
              colorScheme={globalScheme}
            />
          );
        })}
      </ScrollView>
    );
  }

  // Grid layout — bento flex-wrap.
  // Each item carries its own cardWidth/cardHeight derived from image_width span.
  const bentoItems = computeBentoItems(banners, unitWidth, spacing, perRow);

  return (
    <View style={[styles.grid, { gap: spacing }]}>
      {bentoItems.map((banner) => (
        <BannerItem
          key={banner.id}
          item={banner}
          cardWidth={banner.cardWidth}
          cardHeight={banner.cardHeight}
          colorScheme={globalScheme}
        />
      ))}
    </View>
  );
});

BannersView.displayName = 'BannersView';

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  carouselContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default BannersView;

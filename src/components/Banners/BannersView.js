import React, { memo } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import BannerItem from './BannerItem';

// HomeScreen applies paddingHorizontal:14 on each side, so usable width = device - 28.
const USABLE_WIDTH = () => Dimensions.get('window').width - 28;

// Resolve items-per-row + spacing from Journal3 `itemsPerRow` config object.
// The API uses a breakpoint map: c0 = mobile, c1 = tablet, c2 = desktop, sc = small.
// On mobile we read c0 (the smallest breakpoint). Each key maps to an array whose
// first element carries { items, spacing }.
const resolveRowConfig = (itemsPerRow) => {
  const fallback = { items: 1, spacing: 10 };
  if (!itemsPerRow) return fallback;

  // Prefer c0 (mobile), fall back to first key present.
  const candidate = itemsPerRow.c0 || Object.values(itemsPerRow)[0];
  if (!candidate) return fallback;

  // c0 may be an array (standard) or a plain object (breakpoint map variant).
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

// BannersView — renders banners in a responsive flex-row grid.
// It supports both grid layout (carousel:false) and horizontal scroll
// carousel layout (carousel:true or swiper_carousel:true).
const BannersView = memo(({ banners, options }) => {
  if (!banners || banners.length === 0) return null;

  const isCarousel = !!(options.carousel || options.swiper_carousel);
  const { items: perRow, spacing } = resolveRowConfig(options.itemsPerRow);

  const usableWidth = USABLE_WIDTH();
  // cardWidth = (usableWidth - spacing between cards) / perRow
  const totalGap = spacing * (perRow - 1);
  const cardWidth = (usableWidth - totalGap) / perRow;

  // Card height: use the module-level imageDimensions aspect ratio when available,
  // else fall back to the per-item dimensions, else square.
  const computeCardHeight = (banner) => {
    const modW = options.imageDimensions?.width || options.width;
    const modH = options.imageDimensions?.height || options.height;
    if (modW && modH) {
      return Math.round(cardWidth * (modH / modW));
    }
    const itemW = banner.imageWidth;
    const itemH = banner.imageHeight;
    if (itemW && itemH) {
      return Math.round(cardWidth * (itemH / itemW));
    }
    return cardWidth; // square fallback
  };

  const globalScheme = options.color_scheme || '';

  if (isCarousel) {
    // Horizontal scroll carousel — each card is full-width (perRow = 1 for carousel UX)
    const carouselCardWidth = usableWidth;
    return (
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.carouselContent, { gap: spacing }]}
      >
        {banners.map((banner) => {
          const height = computeCardHeight(banner);
          return (
            <BannerItem
              key={banner.id}
              item={banner}
              cardWidth={carouselCardWidth}
              cardHeight={height}
              colorScheme={globalScheme}
            />
          );
        })}
      </ScrollView>
    );
  }

  // Grid layout — flex-row wrap
  return (
    <View
      style={[
        styles.grid,
        { columnGap: spacing, rowGap: spacing },
      ]}
    >
      {banners.map((banner) => {
        const height = computeCardHeight(banner);
        return (
          <BannerItem
            key={banner.id}
            item={banner}
            cardWidth={cardWidth}
            cardHeight={height}
            colorScheme={globalScheme}
          />
        );
      })}
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

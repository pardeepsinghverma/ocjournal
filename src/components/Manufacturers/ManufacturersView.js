import React, { useRef, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import ManufacturerItem from './ManufacturerItem';

// Usable width matches Home screen's paddingHorizontal: 14 on each side.
const USABLE_WIDTH = () => Dimensions.get('window').width - 28;

/**
 * ManufacturersView
 *
 * Renders a horizontal strip of brand logo cards. Supports two modes:
 *
 *  carousel = true  → react-native-reanimated-carousel with pagination dots,
 *                      respecting options.carouselOptions (autoplay, loop, speed).
 *                      Items per "page" = settings.itemsPerPage (from itemsPerRow.sc).
 *
 *  carousel = false → plain horizontal ScrollView (free scroll through all brands).
 *
 * Props:
 *  brands      — array of view-model objects: { id, name, imageUri, onPress }
 *  settings    — {
 *                  carousel, autoplay, loop, speed,
 *                  itemsPerPage, imageWidth, imageHeight
 *                }
 */
const ManufacturersView = ({ brands = [], settings = {} }) => {
  if (!brands.length) { return null; }

  const {
    carousel = false,
    autoplay = false,
    loop = false,
    speed = 500,
    itemsPerPage = 4,
    imageWidth = 80,
    imageHeight = 80,
  } = settings;

  const usableWidth = USABLE_WIDTH();
  // Gap between cards — keep proportional but not too tight.
  const GAP = 10;
  // Card width derived from usable width and items per page.
  const cardWidth = Math.floor((usableWidth - GAP * (itemsPerPage - 1)) / itemsPerPage);
  // Card height: image + name label + padding
  const cardHeight = imageHeight + 36;
  // Clamp image so it always fits inside the card
  const clampedImgW = Math.min(imageWidth, cardWidth - 16);
  const clampedImgH = Math.min(imageHeight, cardHeight - 36);

  if (carousel && brands.length > itemsPerPage) {
    return (
      <CarouselStrip
        brands={brands}
        usableWidth={usableWidth}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        imageWidth={clampedImgW}
        imageHeight={clampedImgH}
        itemsPerPage={itemsPerPage}
        gap={GAP}
        autoplay={autoplay}
        loop={loop}
        speed={speed}
      />
    );
  }

  // Plain horizontal scroll — used when carousel=false or fewer items than a page.
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, { gap: GAP }]}
    >
      {brands.map((brand) => (
        <ManufacturerItem
          key={brand.id}
          brand={brand}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          imageWidth={clampedImgW}
          imageHeight={clampedImgH}
        />
      ))}
    </ScrollView>
  );
};

// ---------------------------------------------------------------------------
// CarouselStrip — groups brands into pages and uses reanimated-carousel.
// ---------------------------------------------------------------------------
const CarouselStrip = ({
  brands,
  usableWidth,
  cardWidth,
  cardHeight,
  imageWidth,
  imageHeight,
  itemsPerPage,
  gap,
  autoplay,
  loop,
  speed,
}) => {
  const carouselRef = useRef(null);
  const [active, setActive] = useState(0);

  // Split brands into pages of `itemsPerPage` each.
  const pages = [];
  for (let i = 0; i < brands.length; i += itemsPerPage) {
    pages.push(brands.slice(i, i + itemsPerPage));
  }

  const carouselHeight = cardHeight + 12; // small vertical buffer

  const goTo = (index) => {
    if (index === active) { return; }
    carouselRef.current?.scrollTo({ count: index - active, animated: true });
  };

  const renderPage = ({ item: page }) => (
    <View style={[styles.page, { width: usableWidth, gap }]}>
      {page.map((brand) => (
        <ManufacturerItem
          key={brand.id}
          brand={brand}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          imageWidth={imageWidth}
          imageHeight={imageHeight}
        />
      ))}
    </View>
  );

  return (
    <View>
      <Carousel
        ref={carouselRef}
        loop={loop && pages.length > 1}
        width={usableWidth}
        height={carouselHeight}
        autoPlay={autoplay && pages.length > 1}
        autoPlayInterval={3000}
        scrollAnimationDuration={speed}
        data={pages}
        snapEnabled
        pagingEnabled
        windowSize={3}
        panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
        onSnapToItem={setActive}
        renderItem={renderPage}
      />

      {pages.length > 1 && (
        <View style={styles.paginationRow}>
          <View style={styles.paginationPill}>
            {pages.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => goTo(i)}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
                style={[styles.dot, i === active && styles.dotActive]}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 2,
    paddingVertical: 6,
  },
  page: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  paginationRow: {
    alignItems: 'center',
    marginTop: 10,
  },
  paginationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#C9C5BD',
  },
  dotActive: {
    width: 18,
    backgroundColor: '#444444',
  },
});

export default ManufacturersView;

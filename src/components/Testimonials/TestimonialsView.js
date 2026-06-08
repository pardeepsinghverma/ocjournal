import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import TestimonialCard from './TestimonialCard';

// Home screen applies paddingHorizontal: 14, so usable width = window.width - 28.
const USABLE_WIDTH = () => Dimensions.get('window').width - 28;

// Spacing between cards when multiple items show per "slide".
const CARD_SPACING = 12;

const TestimonialsView = ({ cards = [], settings = {}, moduleScheme }) => {
  const carouselRef = useRef(null);
  const [active, setActive] = useState(0);

  if (!cards.length) return null;

  const width = USABLE_WIDTH();

  // How many cards fit side-by-side (from options.itemsPerRow.sc).
  // Default to 1 for phone layout.
  const perRow = Math.max(1, settings.itemsPerPage || 1);
  const totalSpacing = CARD_SPACING * (perRow - 1);
  const cardWidth = Math.floor((width - totalSpacing) / perRow);

  // Estimate card height based on typical content length.
  // We use a tall enough fixed height to avoid clipping most quotes.
  const cardHeight = 220;

  const goTo = (index) => {
    if (index === active) return;
    carouselRef.current?.scrollTo({ count: index - active, animated: true });
  };

  // Section title (optional)
  const title = settings.moduleTitle && settings.moduleTitle !== 'DEFAULT'
    ? settings.moduleTitle
    : null;

  return (
    <View>
      {!!title && (
        <Text style={[styles.sectionTitle, { color: moduleScheme.text }]}>{title}</Text>
      )}

      <Carousel
        ref={carouselRef}
        loop={settings.loop && cards.length > 1}
        width={width}
        height={cardHeight}
        autoPlay={settings.autoplay && cards.length > 1}
        autoPlayInterval={settings.autoplayDelay || 3000}
        scrollAnimationDuration={settings.speed || 500}
        data={cards}
        snapEnabled
        pagingEnabled
        windowSize={3}
        panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
        onSnapToItem={setActive}
        renderItem={({ item }) => (
          <TestimonialCard card={item} cardWidth={cardWidth} />
        )}
      />

      {cards.length > 1 && (
        <View style={styles.paginationRow}>
          <View style={styles.paginationPill}>
            {cards.map((_, i) => (
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  paginationRow: {
    alignItems: 'center',
    marginTop: 12,
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

export default TestimonialsView;

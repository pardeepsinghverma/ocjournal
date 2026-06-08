import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { SlideItem } from './SlideItem';

const Slider = ({ slides = [], settings = {} }) => {
  const carouselRef = useRef(null);
  const [active, setActive] = useState(0);

  if (!slides.length) return null;

  // The Home screen pads the page by 14px on each side, so the carousel spans
  // the screen width minus that gutter.
  const width = Dimensions.get('window').width - 28;
  const ratio = settings.imageRatio || 450 / 700;
  const imageHeight = Math.round(width * ratio);
  const contentHeight = settings.hasButtons ? 235 : 180;
  const height = imageHeight + contentHeight;

  const goTo = (index) => {
    if (index === active) return;
    carouselRef.current?.scrollTo({ count: index - active, animated: true });
  };

  return (
    <View>
      <Carousel
        ref={carouselRef}
        loop={settings.loop && slides.length > 1}
        width={width}
        height={height}
        autoPlay={settings.autoplay && slides.length > 1}
        autoPlayInterval={settings.interval || 4000}
        scrollAnimationDuration={settings.speed || 550}
        data={slides}
        snapEnabled
        pagingEnabled
        windowSize={3}
        panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
        onSnapToItem={setActive}
        renderItem={({ item }) => <SlideItem slide={item} imageHeight={imageHeight} />}
      />

      {slides.length > 1 && (
        <View style={styles.paginationRow}>
          <View style={styles.paginationPill}>
            {slides.map((_, i) => (
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

export default Slider;

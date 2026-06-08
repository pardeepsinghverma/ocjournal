import React, { useRef } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useSharedValue } from 'react-native-reanimated';
import { Image, View } from 'tamagui';
import ProductImagePagination from './ProductImagePagination';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CAROUSEL_HEIGHT = 540;

const renderItem = ({ item }) => {
  if (!item?.image) {
    return (
      <View
        width={SCREEN_WIDTH}
        height="100%"
        backgroundColor="#f2f2f2"
      />
    );
  }
  return (
    <Image
      source={{ uri: item.image }}
      style={{ width: SCREEN_WIDTH, height: '100%' }}
    />
  );
};

const ProductImageCarousel = ({ slides = [] }) => {
  const carouselRef = useRef(null);
  const progress = useSharedValue(0);

  const handleProgressChange = (_, absoluteProgress) => {
    progress.value = absoluteProgress;
  };

  const handleDotPress = index => {
    const current = Math.round(progress.value);
    const delta = index - current;
    if (!delta) return;
    carouselRef.current?.scrollTo({ count: delta, animated: true });
  };

  if (!slides.length) return null;

  return (
    <>
      <Carousel
        ref={carouselRef}
        loop
        width={SCREEN_WIDTH}
        height={CAROUSEL_HEIGHT}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 10,
          parallaxAdjacentItemScale: 1,
        }}
        spacing={10}
        snapEnabled
        pagingEnabled
        autoPlay={false}
        autoPlayInterval={2000}
        quickSnap
        windowSize={3}
        panGestureHandlerProps={{ activeOffsetX: [-10, 10] }}
        data={slides}
        renderItem={renderItem}
        onProgressChange={handleProgressChange}
      />
      <ProductImagePagination
        count={slides.length}
        progress={progress}
        onDotPress={handleDotPress}
      />
    </>
  );
};

export default ProductImageCarousel;

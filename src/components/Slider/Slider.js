import React from 'react';
import { View, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { renderItem } from './render-item';
import { useSharedValue } from 'react-native-reanimated';

const Slider = ({ slideData, options }) => {
  const width = Dimensions.get('window').width;
  const currentIndex = useSharedValue(0);

  return (
    <View
      id="carousel-component"
      dataSet={{ kind: 'basic-layouts', name: 'left-align' }}
    >
      <Carousel
        loop={options.loop || false}
        width={width - 28}
        height={options.height || 200}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 10,
          parallaxAdjacentItemScale: 1,
          parallaxAdjacentItemOpacity: 1, // Add this line to ensure full opacity
        }}
        itemWidth={width - 40 * 2}
        spacing={0}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlayInterval={2000}
        autoPlay={options.autoPlay || false}
        quickSnap={true}
        data={slideData}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        onSnapToItem={(index) => {
          currentIndex.value = index;
        }}
        renderItem={renderItem({
          rounded: true,
          style: { marginRight: 8 },
          currentIndex,
        })}
      />
    </View>
  );
};

export default Slider;
// src/components/Slider.js
import React, { useRef, useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Image, Text, XStack } from 'tamagui';

export default function Slider({
  slides,
  autoSlide = true,
  slideInterval = 3000,
  showArrows = true,
  showBullets = true,
  bulletWithImage = false,
  slideStyle = 1,
  onSlideChange = () => {},
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const slideIntervalRef = useRef(null);

  const width = slideStyle = 1 ? Dimensions.get('window').width : Dimensions.get('window').width - 28; // 14 is padding on its parent
  const eachslideWidth = slideStyle = 1 ? width : width - 28; // to make sure next slide is little visible


  // Animated value for bullet progress
  const progress = useRef(new Animated.Value(0)).current;

  // Slide to the next slide
  const goToNextSlide = () => {
    const nextIndex = (currentIndex + 1) % slides.length;
    setCurrentIndex(nextIndex);
    scrollToIndex(nextIndex);
    onSlideChange(nextIndex);
  };

  // Scroll to the specific index
  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * eachslideWidth, // assuming each slide width is 300px, adjust as needed
      animated: true,
    });
  };

  // Auto slide interval
  useEffect(() => {
    if (autoSlide) {
      slideIntervalRef.current = setInterval(goToNextSlide, slideInterval);
    }
    return () => clearInterval(slideIntervalRef.current);
  }, [currentIndex, autoSlide]);

  // Reset progress animation on each slide change
  useEffect(() => {
    Animated.timing(progress, {
      toValue: 1,
      duration: slideInterval,
      useNativeDriver: false,
    }).start(() => progress.setValue(0));
  }, [currentIndex]);

  // Handle left/right arrow clicks
  const handleLeftArrow = () => {
    const prevIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    scrollToIndex(prevIndex);
    onSlideChange(prevIndex);
  };

  const handleRightArrow = () => {
    goToNextSlide();
  };

  return (
    <View style={{ position: 'relative', alignItems: 'center' }}>
      {/* ScrollView for slides */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={eachslideWidth + 10} // Snap interval includes the gap
        decelerationRate="normal" // Smooth snapping
        onMomentumScrollEnd={(e) => {
          const newIndex = Math.round(e.nativeEvent.contentOffset.x / (eachslideWidth + 10));
          setCurrentIndex(newIndex);
          onSlideChange(newIndex);
        }}
      >
        <XStack alignItems="center" flex={1} gap={10}>
        {slides.map((slide, index) => (
            <View key={index} style={{ width: eachslideWidth }} pad>
              <Image
                src="https://picsum.photos/seed/picsum/200/300"
                width={eachslideWidth}
                height={500}
                background={'$background'}
                // borderRadius="$4"
                borderRadius={0}
              />
              {/* {slide.text && <Text>{slide.text}</Text>} */}
            </View>
          ))}
          </XStack>
      </ScrollView>

      {/* Left Arrow */}
      {showArrows && (
        <TouchableOpacity style={{ position: 'absolute', left: 10, top: '50%' }} onPress={handleLeftArrow}>
          <Text>{'<'}</Text>
        </TouchableOpacity>
      )}

      {/* Right Arrow */}
      {showArrows && (
        <TouchableOpacity style={{ position: 'absolute', right: 10, top: '50%' }} onPress={handleRightArrow}>
          <Text>{'>'}</Text>
        </TouchableOpacity>
      )}

      {/* Bullet Indicators */}
      {showBullets && (
        <View style={{ flexDirection: 'row', position: 'absolute', bottom: 10 }}>
          {slides.map((slide, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setCurrentIndex(index);
                scrollToIndex(index);
                onSlideChange(index);
              }}
              style={{
                margin: 5,
                width: bulletWithImage ? 30 : 10,
                height: bulletWithImage ? 30 : 10,
                borderRadius: 15,
                backgroundColor: currentIndex === index ? '#333' : '#bbb',
              }}
            >
              {bulletWithImage && (
                <Image
                  source={{ uri: slide.image }}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 15,
                    opacity: currentIndex === index ? 1 : 0.5,
                  }}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Progress bar */}
      {autoSlide && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 5,
            width: `${progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 100],
            })}`,
            height: 4,
            border: '8px solid #333',
            zIndex: 1000,
            backgroundColor: '#333',
          }}
        />
      )}
    </View>
  );
}

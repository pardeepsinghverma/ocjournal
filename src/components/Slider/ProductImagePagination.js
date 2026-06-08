import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  interpolateColor,
  Extrapolation,
} from 'react-native-reanimated';
import { XStack } from 'tamagui';

const DOT_HEIGHT = 8;
const DOT_BASE_WIDTH = 8;
const DOT_ACTIVE_WIDTH = 20;
const ACTIVE_COLOR = '#000000';
const INACTIVE_COLOR = '#00000040';

const Dot = ({ index, length, progress, onPress }) => {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet';
    const raw = progress.value - index;
    const distance = Math.min(
      Math.abs(raw),
      Math.abs(raw + length),
      Math.abs(raw - length),
    );

    const width = interpolate(
      distance,
      [0, 1],
      [DOT_ACTIVE_WIDTH, DOT_BASE_WIDTH],
      Extrapolation.CLAMP,
    );
    const backgroundColor = interpolateColor(
      distance,
      [0, 1],
      [ACTIVE_COLOR, INACTIVE_COLOR],
    );

    return { width, backgroundColor };
  });

  return (
    <TouchableWithoutFeedback onPress={() => onPress?.(index)}>
      <Animated.View
        style={[
          {
            height: DOT_HEIGHT,
            borderRadius: DOT_HEIGHT / 2,
          },
          animatedStyle,
        ]}
      />
    </TouchableWithoutFeedback>
  );
};

const ProductImagePagination = ({ count, progress, onDotPress }) => {
  if (!count || count < 2) return null;

  return (
    <XStack
      width="100%"
      justifyContent="center"
      gap={6}
      paddingVertical={15}
      backgroundColor="#ffffff"
    >
      {Array.from({ length: count }).map((_, index) => (
        <Dot
          key={index}
          index={index}
          length={count}
          progress={progress}
          onPress={onDotPress}
        />
      ))}
    </XStack>
  );
};

export default ProductImagePagination;

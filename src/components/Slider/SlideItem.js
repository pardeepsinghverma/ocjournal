import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { Button } from 'tamagui';

export const SlideItem = (props) => {
  const {
    style,
    index = 0,
    rounded = false,
    slideData,
    testID,
    currentIndex,
    ...animatedViewProps
  } = props;

  const animatedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: currentIndex.value === index ? 1 : 0.5,
    };
  });

  return (
    <Animated.View
      testID={testID}
      style={{ width: '95%', flex: 1 }}
      {...animatedViewProps}
    >
      <Animated.Image
        style={[
          style,
          styles.container,
          rounded && { borderRadius: 15 },
          animatedOpacityStyle,
        ]}
        source={{ uri: slideData.image }}
        resizeMode="cover"
      />
      {slideData?.children && (
        <View style={styles.overlay}>
          <View style={styles.overlayTextContainer}>
            {slideData.children.map((child, childIndex) => (
              <ChildItem
                key={childIndex}
                child={child}
                childIndex={childIndex}
                currentIndex={currentIndex}
              />
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );
};

const ChildItem = ({ child, childIndex, currentIndex }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: currentIndex.value === childIndex ? 1 : 0.5,
    };
  });

  if (child.type === 'text') {
    return <Text style={styles.overlayText}>{child.text}</Text>;
  }
  if (child.type === 'image') {
    return (
      <Animated.Image
        source={{ uri: child.data }}
        style={[
          {
            width: 30,
            height: 30,
            borderRadius: 15,
          },
          animatedStyle,
        ]}
      />
    );
  }
  if (child.type === 'button') {
    return (
      <Button onPress={() => console.log('Button pressed')}>
        {child.text}
      </Button>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 10,
    right: 0,
    bottom: 30,
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
  overlayText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  overlayTextContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 10,
    borderRadius: 10,
    minWidth: 40,
    gap: 5,
    minHeight: 40,
    justifyContent: 'flex-start',
    alignItems: 'baseline',
  },
});

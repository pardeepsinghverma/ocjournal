import React, { memo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Button } from 'tamagui';

const resolveSlideLink = (link) => {
  if (!link) return null;
  if (typeof link === 'string') return { type: 'url', url: link };
  if (link.product_id) return { type: 'product', productId: link.product_id };
  if (link.category_id) return { type: 'category', categoryId: link.category_id };
  if (link.href) return { type: 'url', url: link.href };
  return null;
};

const navigateFromLink = (navigation, link) => {
  const resolved = resolveSlideLink(link);
  if (!resolved) return;
  if (resolved.type === 'product') {
    navigation.navigate('productView', { productId: resolved.productId });
  } else if (resolved.type === 'category') {
    navigation.navigate('catalog', { categoryId: resolved.categoryId });
  }
};

export const SlideItem = memo((props) => {
  const {
    style,
    index = 0,
    rounded = false,
    slideData,
    testID,
    currentIndex,
    ...animatedViewProps
  } = props;

  const navigation = useNavigation();

  const animatedOpacityStyle = useAnimatedStyle(() => {
    return {
      // opacity: currentIndex.value === index ? 1 : 0.5,
      opacity: 1,
    };
  });

  const handleSlidePress = () => navigateFromLink(navigation, slideData?.link);

  return (
    <Animated.View
      testID={testID}
      style={{ width: '95%', flex: 1 }}
      {...animatedViewProps}
    >
      <TouchableOpacity activeOpacity={0.9} onPress={handleSlidePress} style={{ flex: 1 }}>
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
      </TouchableOpacity>
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
});

const ChildItem = memo(({ child, childIndex, currentIndex }) => {
  const navigation = useNavigation();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: currentIndex.value === Number(childIndex) ? 1 : 0.5,
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
      <Button onPress={() => navigateFromLink(navigation, child.link || child.data)}>
        {child.text}
      </Button>
    );
  }
  return null;
});

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

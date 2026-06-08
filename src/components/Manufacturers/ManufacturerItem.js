import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// isRealImage: matches the guard used in MasterSlider — rejects localhost/placeholder URLs
// that the demo backend serves, so we fall back to the placeholder asset gracefully.
const isRealImage = (src) =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  /^https?:\/\//i.test(src) &&
  !/localhost|127\.0\.0\.1/i.test(src) &&
  !/placeholder/i.test(src) &&
  !/null|undefined/i.test(src);

/**
 * ManufacturerItem
 *
 * Renders a single brand logo card: white background, logo centred with
 * resizeMode="contain" (preserves aspect ratio), brand name below.
 *
 * Props:
 *  brand       — view-model from Manufacturers.js: { id, name, imageUri, onPress }
 *  cardWidth   — derived from usable screen width / columns
 *  cardHeight  — from options.imageDimensions.height (with padding)
 *  imageWidth  — from options.imageDimensions.width
 *  imageHeight — from options.imageDimensions.height
 */
const ManufacturerItem = memo(({ brand, cardWidth, cardHeight, imageWidth, imageHeight }) => {
  const { name, imageUri, onPress } = brand;

  const hasRealImage = isRealImage(imageUri);
  const imgSource = hasRealImage
    ? { uri: imageUri }
    : {
        uri: `https://placehold.co/${Math.round(imageWidth)}x${Math.round(imageHeight)}/EEE/c3c3c3.png`,
      };

  const card = (
    <View style={[styles.card, { width: cardWidth, minHeight: cardHeight }]}>
      <View style={[styles.imageWrap, { width: imageWidth, height: imageHeight }]}>
        <Image
          source={imgSource}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      {!!name && (
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        {card}
      </TouchableOpacity>
    );
  }
  return card;
});

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 8,
    // Subtle shadow so the white card is visible on light backgrounds
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#EBEBEB',
  },
  imageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
  },
});

export default ManufacturerItem;

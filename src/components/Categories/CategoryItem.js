import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RichText } from '../common/RichText';
import { getColorScheme } from '../common/colorSchemes';

// Single category card.
// Supports two style modes driven by options.moduleCategory:
//   "LARGE"  — image on top, name + description below the image
//   default  — compact square with name overlaid at the bottom
const CategoryItem = memo(({ category, cardWidth, imageHeight, moduleCategory, showCount, countText, showDescription, descLimit, colorScheme }) => {
  const navigation = useNavigation();
  const scheme = getColorScheme(colorScheme);

  const handlePress = () => {
    navigation.navigate('catalog', { categoryId: category.categoryId });
  };

  const isLarge = String(moduleCategory).toUpperCase() === 'LARGE';

  // Build product count string e.g. "14 Product(s)"
  const countLabel =
    showCount && category.total != null
      ? (countText || '%s Product(s)').replace('%s', category.total)
      : null;

  // Truncate description to descLimit characters
  const desc =
    showDescription && category.description
      ? category.description.slice(0, descLimit || 75)
      : null;

  if (isLarge) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        style={[styles.largeCard, { width: cardWidth, backgroundColor: scheme.surface }]}
      >
        <View style={[styles.imageWrap, { height: imageHeight, width: cardWidth }]}>
          <Image
            source={{ uri: category.imageUri }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.largeContent}>
          <RichText
            html={category.name}
            color={scheme.text}
            fontSize={14}
            fontWeight="700"
            numberOfLines={2}
          />
          {!!countLabel && (
            <Text style={[styles.countBadge, { color: scheme.muted }]}>
              {countLabel}
            </Text>
          )}
          {!!desc && (
            <Text style={[styles.description, { color: scheme.muted }]} numberOfLines={2}>
              {desc}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  // Compact / overlay style
  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[styles.compactCard, { width: cardWidth, height: imageHeight }]}
    >
      <Image
        source={{ uri: category.imageUri }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      />
      <View style={styles.overlay} />
      <View style={styles.overlayContent}>
        <RichText
          html={category.name}
          color="#FFFFFF"
          fontSize={13}
          fontWeight="700"
          numberOfLines={2}
        />
        {!!countLabel && (
          <Text style={styles.compactCount}>{countLabel}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

const RADIUS = 10;

const styles = StyleSheet.create({
  largeCard: {
    borderRadius: RADIUS,
    overflow: 'hidden',
    marginBottom: 4,
  },
  imageWrap: {
    overflow: 'hidden',
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  largeContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  countBadge: {
    fontSize: 11,
    marginTop: 3,
  },
  description: {
    fontSize: 12,
    marginTop: 4,
    lineHeight: 17,
  },
  // compact / overlay
  compactCard: {
    borderRadius: RADIUS,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.32)',
  },
  overlayContent: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  compactCount: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    marginTop: 2,
  },
});

export default CategoryItem;

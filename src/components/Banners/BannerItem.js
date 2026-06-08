import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RichText } from '../common/RichText';
import { getColorScheme } from '../common/colorSchemes';

// Resolve a Journal3 link object to a navigation call.
// link.type can be 'category', 'product', 'url', or empty.
const navigateTo = (navigation, link) => {
  if (!link || !navigation) return;
  if (link.type === 'product' && link.id) {
    navigation.navigate('productView', { productId: link.id });
  } else if (link.type === 'category' && link.id) {
    navigation.navigate('catalog', { categoryId: link.id });
  }
  // Other types (url, etc.) are no-ops — no crash, just ignored.
};

// A single banner card: full-bleed image with an overlay scrim and
// structured text (title, title2 as CTA label, title3 as subtitle).
// Text is rendered inside the image area at the bottom-left, matching
// the Journal3 "BANNERS" style where copy sits over the image.
const BannerItem = memo(({ item, cardWidth, cardHeight, colorScheme: globalScheme }) => {
  const navigation = useNavigation();

  // Per-item color_scheme takes precedence over global module scheme.
  const scheme = getColorScheme(item.colorScheme || globalScheme);

  const hasText = !!(item.title || item.title2 || item.title3);
  const hasLink = !!(item.link && (item.link.type === 'category' || item.link.type === 'product') && item.link.id);

  const card = (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      <Image
        source={{ uri: item.imageUri }}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={item.alt || item.title || 'Banner'}
      />

      {hasText && (
        // Dark scrim gradient starting at the bottom to ensure legibility.
        <View style={styles.scrim} pointerEvents="none">
          <View style={styles.textBlock}>
            {/* title3 as a small label above the main title */}
            {!!item.title3 && (
              <RichText
                html={item.title3}
                color="#FFFFFF"
                fontSize={11}
                fontWeight="500"
                style={styles.title3}
              />
            )}

            {/* title is the primary heading */}
            {!!item.title && (
              <RichText
                html={item.title}
                color="#FFFFFF"
                fontSize={18}
                fontWeight="700"
                numberOfLines={2}
                style={styles.title}
              />
            )}

            {/* title2 is the CTA / sub-label (e.g. "See products") */}
            {!!item.title2 && (
              <View style={[styles.ctaWrap, { borderColor: scheme.accent }]}>
                <RichText
                  html={item.title2}
                  color={scheme.accent}
                  fontSize={12}
                  fontWeight="600"
                />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );

  if (hasLink) {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => navigateTo(navigation, item.link)}
        style={{ borderRadius: RADIUS, overflow: 'hidden' }}
      >
        {card}
      </TouchableOpacity>
    );
  }

  return <View style={{ borderRadius: RADIUS, overflow: 'hidden' }}>{card}</View>;
});

BannerItem.displayName = 'BannerItem';

const RADIUS = 10;

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS,
    overflow: 'hidden',
    backgroundColor: '#E0E0E0',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Semi-transparent gradient effect via layered solid-color View.
  // A true LinearGradient would require an extra dependency; this approach
  // uses two stacked Views (transparent top, dark bottom) to simulate it.
  scrim: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    // Tall enough to cover the bottom ~50% of the card.
    top: '50%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  textBlock: {
    paddingHorizontal: 14,
    paddingBottom: 14,
    paddingTop: 8,
  },
  title3: {
    marginBottom: 2,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
  title: {
    marginBottom: 6,
  },
  ctaWrap: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 2,
  },
});

export default BannerItem;

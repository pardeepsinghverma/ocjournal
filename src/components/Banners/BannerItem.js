import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Resolve a Journal3 link object to a navigation call.
const navigateTo = (navigation, link) => {
  if (!link || !navigation) return;
  if (link.type === 'product' && link.id) {
    navigation.navigate('productView', { productId: link.id });
  } else if (link.type === 'category' && link.id) {
    navigation.navigate('catalog', { categoryId: link.id });
  }
};

// A single banner card.
//
// Web layout (Journal3 "Simple Banners / Bento" style):
//   - Full-bleed image fills the card
//   - `title`  → small white chip at the TOP-LEFT corner (category label)
//   - `title2` → NOT shown on mobile (hover-only on web)
//   - `title3` → shown below `title` inside the chip when present
//   - `text`   → shown as a bold overlay line when present (e.g. "up to -50%")
//
// The chip background is semi-transparent white so the image shows through
// slightly, matching the frosted-glass style used on the web.
const BannerItem = memo(({ item, cardWidth, cardHeight, colorScheme: _colorScheme }) => {
  const navigation = useNavigation();

  const hasLink = !!(
    item.link &&
    (item.link.type === 'category' || item.link.type === 'product') &&
    item.link.id
  );

  const card = (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      {/* Full-bleed background image */}
      <Image
        source={{ uri: item.imageUri }}
        style={styles.image}
        resizeMode="cover"
        accessibilityLabel={item.alt || item.title || 'Banner'}
      />

      {/* Top-left label chip — title (+ optional title3 subtitle) */}
      {!!(item.title || item.title3) && (
        <View style={styles.chip} pointerEvents="none">
          {!!item.title3 && (
            <Text style={styles.chipSub} numberOfLines={1}>
              {item.title3.replace(/<[^>]*>/g, '').trim()}
            </Text>
          )}
          <Text style={styles.chipTitle} numberOfLines={1}>
            {item.title.replace(/<[^>]*>/g, '').trim()}
          </Text>
        </View>
      )}

      {/* Optional bold text overlay (e.g. "up to -50%") from `text` field */}
      {!!item.text && (
        <View style={styles.textOverlay} pointerEvents="none">
          <Text style={styles.textOverlayText} numberOfLines={3}>
            {item.text.replace(/<[^>]*>/g, '').trim()}
          </Text>
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
    backgroundColor: '#E8E8E8',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // White frosted-glass chip at top-left, matching the Journal3 web label style.
  chip: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderRadius: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    maxWidth: '70%',
  },
  chipSub: {
    fontSize: 10,
    fontWeight: '500',
    color: '#555555',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 1,
  },
  chipTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
  },
  // Bold overlay for promotional text (e.g. "up to -50%") rendered mid-card.
  textOverlay: {
    position: 'absolute',
    bottom: 14,
    left: 10,
    right: 10,
  },
  textOverlayText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});

export default BannerItem;

import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Star } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/native';
import { getPlaceholderImage } from '../../utils/getImage';

// Determine whether a URL is a real remote asset (not localhost/placeholder).
const isRealImage = (src) =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  /^https?:\/\//i.test(src) &&
  !/localhost|127\.0\.0\.1/i.test(src) &&
  !/placeholder/i.test(src) &&
  !/null|undefined/i.test(src);

// Format a raw price string like "714.9600" into "$714.96".
// The API does not supply pre-formatted currency strings for products,
// so we apply a basic 2-decimal formatter with a dollar prefix.
const formatPrice = (raw) => {
  if (raw == null) return null;
  const num = parseFloat(raw);
  if (Number.isNaN(num)) return null;
  return `$${num.toFixed(2)}`;
};

// Render up to 5 star icons at a given rating (0–5 integer or float).
const RatingStars = memo(({ rating, size, color, emptyColor }) => {
  const filled = Math.round(rating || 0);
  return (
    <View style={styles.starsRow}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size || 11}
          color={i < filled ? (color || '#F5A623') : (emptyColor || '#D4D4D4')}
          fill={i < filled ? (color || '#F5A623') : 'none'}
        />
      ))}
    </View>
  );
});

const ProductCard = memo(({ product, cardWidth, imageHeight, showRating, showCartButton, cartLabel }) => {
  const navigation = useNavigation();

  const imageUri = isRealImage(product.image)
    ? product.image
    : getPlaceholderImage(product.image, Math.round(cardWidth), Math.round(imageHeight), 'Product');

  const currentPrice = formatPrice(product.special || product.price);
  const wasPrice = product.special ? formatPrice(product.price) : null;

  const handlePress = () => {
    if (product.id) {
      navigation.navigate('productView', { productId: product.id });
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={handlePress}
      style={[styles.card, { width: cardWidth }]}
    >
      {/* Product image */}
      <View style={[styles.imageWrap, { height: imageHeight }]}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Sale badge when a special price exists */}
        {!!wasPrice && (
          <View style={styles.saleBadge}>
            <Text style={styles.saleBadgeText}>Sale</Text>
          </View>
        )}
      </View>

      {/* Card body */}
      <View style={styles.body}>
        {/* Rating row — only shown when enabled */}
        {showRating && (
          <View style={styles.ratingRow}>
            <RatingStars rating={product.rating} />
            {product.reviews > 0 && (
              <Text style={styles.reviewCount}>({product.reviews})</Text>
            )}
          </View>
        )}

        {/* Product name — plain text, no HTML in name field */}
        <Text style={styles.name} numberOfLines={2}>
          {product.name || ''}
        </Text>

        {/* Manufacturer/brand */}
        {!!product.manufacturer && (
          <Text style={styles.brand} numberOfLines={1}>
            {product.manufacturer}
          </Text>
        )}

        {/* Price row */}
        <View style={styles.priceRow}>
          {currentPrice ? (
            <Text style={[styles.price, wasPrice ? styles.priceSpecial : null]}>
              {currentPrice}
            </Text>
          ) : null}
          {wasPrice ? (
            <Text style={styles.priceWas}>{wasPrice}</Text>
          ) : null}
        </View>

        {/* Add to cart button */}
        {showCartButton && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handlePress}
            style={styles.cartButton}
          >
            <Text style={styles.cartButtonText}>
              {cartLabel || 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginBottom: 12,
  },
  imageWrap: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  saleBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#E53935',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
  },
  saleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  body: {
    padding: 10,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 1,
  },
  reviewCount: {
    fontSize: 10,
    color: '#888888',
    marginLeft: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    lineHeight: 18,
    marginBottom: 2,
  },
  brand: {
    fontSize: 11,
    color: '#888888',
    marginBottom: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  priceSpecial: {
    color: '#D32F2F',
  },
  priceWas: {
    fontSize: 12,
    color: '#AAAAAA',
    textDecorationLine: 'line-through',
  },
  cartButton: {
    marginTop: 8,
    backgroundColor: '#1A1A1A',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default ProductCard;

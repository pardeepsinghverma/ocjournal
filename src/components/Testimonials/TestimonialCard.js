import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { RichText } from '../common/RichText';
import { getColorScheme } from '../common/colorSchemes';

// Quote icon drawn with simple View shapes so we avoid an SVG dep.
const QuoteIcon = ({ color }) => (
  <View style={styles.quoteRow}>
    <View style={[styles.quoteMark, { backgroundColor: color }]} />
    <View style={[styles.quoteMark, styles.quoteMarkSecond, { backgroundColor: color }]} />
  </View>
);

// 5-star row — uses filled blocks (accent color) vs muted color.
const StarRow = ({ rating, accent, muted }) => {
  const filled = Math.min(5, Math.max(0, Math.round(rating || 5)));
  return (
    <View style={styles.starRow}>
      {[1, 2, 3, 4, 5].map((n) => (
        <View
          key={n}
          style={[
            styles.star,
            { backgroundColor: n <= filled ? accent : muted },
          ]}
        />
      ))}
    </View>
  );
};

const TestimonialCard = memo(({ card, cardWidth }) => {
  const scheme = getColorScheme(card.colorScheme);

  return (
    <View style={[styles.card, { width: cardWidth, backgroundColor: scheme.surface }]}>
      {/* Quote header icon */}
      <QuoteIcon color={scheme.accent} />

      {/* Quote body */}
      <View style={styles.quoteBody}>
        <RichText
          html={card.content}
          color={scheme.text}
          fontSize={14}
          lineHeight={22}
        />
      </View>

      {/* Star rating */}
      {card.rating != null && (
        <StarRow rating={card.rating} accent={scheme.accent} muted={scheme.muted} />
      )}

      {/* Author row: avatar + name */}
      <View style={styles.authorRow}>
        <Image
          source={{ uri: card.avatarUri }}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.authorMeta}>
          <RichText
            html={card.author}
            color={scheme.text}
            fontSize={13}
            fontWeight="600"
          />
          {!!card.role && (
            <RichText
              html={card.role}
              color={scheme.muted}
              fontSize={12}
            />
          )}
        </View>
      </View>
    </View>
  );
});

const RADIUS = 14;
const AVATAR_SIZE = 44;

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS,
    padding: 20,
    // Subtle shadow for depth
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quoteRow: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 14,
  },
  quoteMark: {
    width: 10,
    height: 7,
    borderRadius: 3,
    opacity: 0.55,
  },
  quoteMarkSecond: {
    marginTop: 4,
  },
  quoteBody: {
    marginBottom: 12,
  },
  starRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  star: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  authorMeta: {
    flex: 1,
    gap: 2,
  },
});

export default TestimonialCard;

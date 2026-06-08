import React, { memo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RichText } from '../common/RichText';
import { getPlaceholderImage } from '../../utils/getImage';

// Detect whether a URL is a real remote image (not localhost / placeholder).
const isRealImage = (src) =>
  typeof src === 'string' &&
  src.trim() !== '' &&
  /^https?:\/\//i.test(src) &&
  !/localhost|127\.0\.0\.1/i.test(src) &&
  !/placeholder/i.test(src);

/**
 * BlogPostCard
 *
 * Props:
 *   post        — normalized view-model (see BlogPosts.js)
 *   cardWidth   — pixel width for this card (computed from columns + spacing)
 *   imageHeight — pixel height for the thumbnail
 *   onPress     — called when card is tapped
 */
const BlogPostCard = memo(({ post, cardWidth, imageHeight, onPress }) => {
  const imgUri = isRealImage(post.thumb)
    ? post.thumb
    : getPlaceholderImage(post.thumb, Math.round(cardWidth), Math.round(imageHeight), 'Blog');

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      style={[styles.card, { width: cardWidth }]}
    >
      {/* Thumbnail */}
      <View style={[styles.imageWrap, { height: imageHeight }]}>
        <Image
          source={{ uri: imgUri }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* Body */}
      <View style={styles.body}>
        {/* Title */}
        <Text style={styles.title} numberOfLines={2}>
          {post.name}
        </Text>

        {/* Excerpt / description — plain text (no inline tags observed) */}
        {!!post.description && (
          <Text style={styles.excerpt} numberOfLines={3}>
            {post.description}
          </Text>
        )}

        {/* Metadata row: author · date · comments */}
        <View style={styles.meta}>
          {!!post.author && (
            <Text style={styles.metaText} numberOfLines={1}>
              {post.author}
            </Text>
          )}
          {!!post.author && (!!post.date || !!post.comments) && (
            <Text style={styles.metaDot}>{' · '}</Text>
          )}
          {!!post.date && (
            <RichText
              html={post.date}
              color="#888888"
              fontSize={12}
              numberOfLines={1}
            />
          )}
          {!!post.date && !!post.comments && (
            <Text style={styles.metaDot}>{' · '}</Text>
          )}
          {!!post.comments && (
            <Text style={styles.metaText} numberOfLines={1}>
              {post.comments} comments
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    overflow: 'hidden',
    // Subtle card shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  imageWrap: {
    width: '100%',
    backgroundColor: '#f0f0f0',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  body: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#141414',
    lineHeight: 21,
  },
  excerpt: {
    fontSize: 13,
    color: '#555555',
    lineHeight: 18,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#888888',
  },
  metaDot: {
    fontSize: 12,
    color: '#aaaaaa',
  },
});

export default BlogPostCard;

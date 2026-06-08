import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Play } from '@tamagui/lucide-icons';

/**
 * Single gallery cell.
 *
 * Props:
 *   item        – normalized gallery item (id, thumbUri, popupUri, title, type,
 *                 videoType, link)
 *   cellSize    – { width, height } in px
 *   onPress     – called with item when the cell is tapped
 */
const GalleryItem = memo(({ item, cellSize, onPress }) => {
  const { thumbUri, title, type } = item;
  const isVideo = type === 'video';

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={() => onPress && onPress(item)}
      style={[styles.cell, { width: cellSize.width, height: cellSize.height }]}
    >
      <Image
        source={{ uri: thumbUri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Video indicator overlay */}
      {isVideo && (
        <View style={styles.videoOverlay} pointerEvents="none">
          <View style={styles.playBadge}>
            <Play size={18} color="#fff" fill="#fff" />
          </View>
        </View>
      )}

      {/* Caption overlay at bottom if present */}
      {!!title && (
        <View style={styles.captionWrap} pointerEvents="none">
          <Text numberOfLines={1} style={styles.caption}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  cell: {
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#EEEEEE',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captionWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 8,
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.42)',
  },
  caption: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '500',
  },
});

export default GalleryItem;

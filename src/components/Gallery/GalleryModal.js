import React, { useState, useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { X, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons';

const SCREEN = Dimensions.get('window');

/**
 * Lightbox modal for the gallery module.
 *
 * Props:
 *   visible      – boolean
 *   items        – array of normalized gallery items
 *   initialIndex – index of the item that was tapped
 *   onClose      – called when the user closes the modal
 */
const GalleryModal = ({ visible, items, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  // Sync when the modal opens with a different item
  React.useEffect(() => {
    if (visible) setCurrentIndex(initialIndex || 0);
  }, [visible, initialIndex]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : items.length - 1));
  }, [items.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => (i < items.length - 1 ? i + 1 : 0));
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex] || items[0];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.backdrop}>
        {/* Close button */}
        <TouchableOpacity
          style={styles.closeBtn}
          activeOpacity={0.8}
          onPress={onClose}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <X size={22} color="#fff" />
        </TouchableOpacity>

        {/* Main image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: current.popupUri || current.thumbUri }}
            style={styles.mainImage}
            resizeMode="contain"
          />
        </View>

        {/* Caption */}
        {!!current.title && (
          <View style={styles.captionBar}>
            <Text numberOfLines={2} style={styles.captionText}>
              {current.title}
            </Text>
          </View>
        )}

        {/* Navigation arrows (only if more than one item) */}
        {items.length > 1 && (
          <>
            <TouchableOpacity
              style={[styles.navBtn, styles.navLeft]}
              activeOpacity={0.8}
              onPress={goPrev}
            >
              <ChevronLeft size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.navBtn, styles.navRight]}
              activeOpacity={0.8}
              onPress={goNext}
            >
              <ChevronRight size={28} color="#fff" />
            </TouchableOpacity>
          </>
        )}

        {/* Thumbnail strip */}
        {items.length > 1 && (
          <FlatList
            data={items}
            keyExtractor={(it, idx) => it.id || String(idx)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbStrip}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={() => setCurrentIndex(index)}
                style={[
                  styles.thumbCell,
                  index === currentIndex && styles.thumbActive,
                ]}
              >
                <Image
                  source={{ uri: item.popupThumbUri || item.thumbUri }}
                  style={styles.thumb}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}
          />
        )}

        {/* Counter */}
        <Text style={styles.counter}>
          {currentIndex + 1} / {items.length}
        </Text>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.93)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  imageContainer: {
    width: SCREEN.width,
    height: SCREEN.height * 0.62,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  captionBar: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    alignItems: 'center',
  },
  captionText: {
    color: '#EEEEEE',
    fontSize: 13,
    textAlign: 'center',
  },
  navBtn: {
    position: 'absolute',
    top: '40%',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  navLeft: {
    left: 12,
  },
  navRight: {
    right: 12,
  },
  thumbStrip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  thumbCell: {
    width: 56,
    height: 56,
    borderRadius: 4,
    marginHorizontal: 3,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: '#FFFFFF',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  counter: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 12,
    marginTop: 4,
  },
});

export default GalleryModal;

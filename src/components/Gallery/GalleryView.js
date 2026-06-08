import React, { useState, useCallback, useMemo } from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import GalleryItem from './GalleryItem';
import GalleryModal from './GalleryModal';

const SCREEN_WIDTH = Dimensions.get('window').width;
// HomeScreen applies paddingHorizontal: 14 on both sides
const USABLE_WIDTH = SCREEN_WIDTH - 28;

/**
 * Grid / carousel shell for the gallery module.
 *
 * Props:
 *   items    – normalized item array
 *   settings – {
 *     cols     : number  (items per row for phone)
 *     gap      : number  (px between cells)
 *     carousel : boolean (horizontal scroll vs grid)
 *   }
 */
const GalleryView = ({ items, settings }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { cols, gap, carousel } = settings;
  const safeCols = Math.max(1, cols || 3);
  const safeGap = gap >= 0 ? gap : 8;

  // Memoize cellSize so useCallback deps remain stable across renders
  const cellSize = useMemo(() => {
    const cellWidth = Math.floor(
      (USABLE_WIDTH - safeGap * (safeCols - 1)) / safeCols,
    );
    return { width: cellWidth, height: cellWidth }; // square cells (1:1 thumb ratio)
  }, [safeCols, safeGap]);

  // Memoize carousel content container style with gap baked in
  const carouselContentStyle = useMemo(
    () => ({ paddingVertical: 2, gap: safeGap }),
    [safeGap],
  );

  const handlePress = useCallback(
    (item) => {
      const idx = items.findIndex((it) => it.id === item.id);
      setSelectedIndex(idx >= 0 ? idx : 0);
      setModalVisible(true);
    },
    [items],
  );

  const handleClose = useCallback(() => setModalVisible(false), []);

  const renderItem = useCallback(
    ({ item }) => (
      <GalleryItem item={item} cellSize={cellSize} onPress={handlePress} />
    ),
    [cellSize, handlePress],
  );

  const keyExtractor = useCallback(
    (item, index) => item.id || String(index),
    [],
  );

  // Guard: all hooks are declared above so this early return is safe
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.container}>
      {carousel ? (
        /* Horizontal carousel: FlatList with gap via contentContainerStyle */
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={carouselContentStyle}
        />
      ) : (
        /* Grid: rows of `safeCols` columns. HomeScreen is the scroll root. */
        <View style={styles.grid}>
          {chunkArray(items, safeCols).map((row, rowIndex) => (
            <View
              key={rowIndex}
              style={[styles.row, rowIndex > 0 && { marginTop: safeGap }]}
            >
              {row.map((item, colIndex) => (
                <View
                  key={item.id || colIndex}
                  style={colIndex > 0 ? { marginLeft: safeGap } : undefined}
                >
                  <GalleryItem
                    item={item}
                    cellSize={cellSize}
                    onPress={handlePress}
                  />
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      <GalleryModal
        visible={modalVisible}
        items={items}
        initialIndex={selectedIndex}
        onClose={handleClose}
      />
    </View>
  );
};

/**
 * Split an array into chunks of `size`.
 */
function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default GalleryView;

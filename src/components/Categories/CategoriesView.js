import React, { useCallback } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import CategoryItem from './CategoryItem';

// Usable width: HomeScreen adds paddingHorizontal 14 on each side → subtract 28.
const USABLE_WIDTH = Dimensions.get('window').width - 28;

/**
 * CategoriesView — grid or horizontal-scroll shell for category cards.
 *
 * Props:
 *   categories  — normalized array of category view-models
 *   settings    — derived config object from the module entry:
 *     columns      : from itemsPerRow.sc[0].items (API: 1 on phone) or
 *                    c0 breakpoint → "500"=1.  Both paths yield 1 for phone.
 *     gapSize      : from itemsPerRow.sc[0].spacing (API: 20 on phone).
 *     imageRatio   : imgH / imgW from options.imageDimensions.
 *     carousel     : boolean.
 *
 * Card width formula (grid mode):
 *   cardWidth = (USABLE_WIDTH - gapSize * (cols - 1)) / cols
 *
 * The gap between FlatList columns is applied via columnWrapperStyle.gap so it
 * only applies between items, NOT on the outer edges of the row.  Using
 * marginHorizontal on each item would add outer-edge padding and cause the row
 * to overflow USABLE_WIDTH by exactly gapSize.
 *
 * SeparatorGap height matches gapSize (not hardcoded) so row gaps are uniform.
 */
const CategoriesView = ({ categories, settings }) => {
  const {
    columns = 2,
    gapSize = 12,
    imageRatio = 1,
    moduleCategory = 'LARGE',
    carousel = false,
    showCount = false,
    countText = '%s Product(s)',
    showDescription = false,
    descLimit = 75,
    colorScheme = '',
  } = settings || {};

  const cols = Math.max(1, Math.round(columns));

  // Total horizontal space consumed by gaps *between* cols (outer edges excluded).
  const totalGap = gapSize * (cols - 1);
  const cardWidth = (USABLE_WIDTH - totalGap) / cols;
  const imageHeight = Math.round(cardWidth * imageRatio);

  const sharedItemProps = {
    imageHeight,
    moduleCategory,
    showCount,
    countText,
    showDescription,
    descLimit,
    colorScheme,
  };

  const keyExtractor = useCallback((item) => String(item.categoryId), []);

  // No marginHorizontal here — column gaps are handled by columnWrapperStyle.gap
  // so the outer edges of each row remain flush with USABLE_WIDTH.
  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ width: cardWidth }}>
        <CategoryItem category={item} cardWidth={cardWidth} {...sharedItemProps} />
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardWidth, imageHeight, moduleCategory, showCount, countText, showDescription, descLimit, colorScheme],
  );

  // Guard after hooks — hooks must be called unconditionally
  if (!categories || categories.length === 0) return null;

  if (carousel) {
    // Horizontal scroll — cards peek at the edge to signal scrollability
    const peekWidth = cardWidth + gapSize;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((cat) => (
          <View key={cat.categoryId} style={{ marginRight: gapSize, width: peekWidth }}>
            <CategoryItem
              category={cat}
              cardWidth={peekWidth}
              {...sharedItemProps}
            />
          </View>
        ))}
      </ScrollView>
    );
  }

  // Grid — FlatList with columnWrapperStyle.gap for inter-column spacing and
  // a SeparatorGap sized to gapSize for inter-row spacing.
  const columnWrapper = cols > 1 ? [styles.row, { gap: gapSize }] : undefined;
  // Stable component reference for the row separator — FlatList sees the same
  // type every render so it does not needlessly unmount/remount separators.
  const RowSeparator = useCallback(
    () => <View style={{ height: gapSize }} />,
    [gapSize],
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={keyExtractor}
      numColumns={cols}
      scrollEnabled={false}
      columnWrapperStyle={columnWrapper}
      renderItem={renderItem}
      ItemSeparatorComponent={RowSeparator}
      contentContainerStyle={styles.gridContent}
    />
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 4,
  },
  row: {
    justifyContent: 'flex-start',
    // gap is injected inline from gapSize — do NOT add a static gap here.
  },
  gridContent: {
    paddingHorizontal: 0,
  },
});

export default CategoriesView;

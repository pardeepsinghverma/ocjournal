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
 *   settings    — derived config object from the module entry
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

  // Total horizontal space consumed by gaps between cols
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

  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ width: cardWidth, marginHorizontal: gapSize / 2 }}>
        <CategoryItem category={item} cardWidth={cardWidth} {...sharedItemProps} />
      </View>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cardWidth, gapSize, imageHeight, moduleCategory, showCount, countText, showDescription, descLimit, colorScheme],
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

  // Grid — FlatList with row separators applied via item margin
  return (
    <FlatList
      data={categories}
      keyExtractor={keyExtractor}
      numColumns={cols}
      scrollEnabled={false}
      columnWrapperStyle={cols > 1 ? styles.row : undefined}
      renderItem={renderItem}
      ItemSeparatorComponent={SeparatorGap}
      contentContainerStyle={styles.gridContent}
    />
  );
};

// Defined outside the component so React sees a stable type
const SeparatorGap = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 4,
  },
  row: {
    justifyContent: 'flex-start',
  },
  gridContent: {
    paddingHorizontal: 0,
  },
  separator: {
    height: 12,
  },
});

export default CategoriesView;

import React, { memo, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ProductCard from './ProductCard';

const USABLE_WIDTH = Dimensions.get('window').width - 28;
const CARD_GAP = 10;

// Derive the number of grid columns for mobile from the autoGridStyle option.
// LARGE  = 2 columns, MEDIUM = 3 columns, SMALL = 4 columns.
// When displaying as carousel, always 1 column per slide (handled by parent).
const gridColumnsFromStyle = (autoGridStyle) => {
  switch (String(autoGridStyle || '').toUpperCase()) {
    case 'SMALL':
      return 3;
    case 'MEDIUM':
      return 2;
    case 'LARGE':
    default:
      return 2;
  }
};

// -------------------------------------------------------------------
// Tab strip (only rendered when the module has >1 tab with titles)
// -------------------------------------------------------------------
const TabStrip = memo(({ tabs, activeIndex, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.tabScroll}
    contentContainerStyle={styles.tabContent}
  >
    {tabs.map((tab, i) => {
      const active = i === activeIndex;
      return (
        <TouchableOpacity
          key={tab.id || i}
          onPress={() => onSelect(i)}
          style={[styles.tab, active && styles.tabActive]}
          activeOpacity={0.75}
        >
          <Text style={[styles.tabText, active && styles.tabTextActive]}>
            {tab.title || `Tab ${i + 1}`}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
));

// -------------------------------------------------------------------
// Single product grid panel (one tab's worth of products)
// -------------------------------------------------------------------
const ProductGrid = memo(({ products, settings }) => {
  const { cols, cardWidth, imageHeight, showRating, showCartButton, cartLabel } = settings;

  if (!products || products.length === 0) {
    return null;
  }

  // Group products into rows of `cols` items.
  const rows = [];
  for (let i = 0; i < products.length; i += cols) {
    rows.push(products.slice(i, i + cols));
  }

  return (
    <View style={styles.grid}>
      {rows.map((row, rowIdx) => (
        <View key={rowIdx} style={styles.row}>
          {row.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cardWidth={cardWidth}
              imageHeight={imageHeight}
              showRating={showRating}
              showCartButton={showCartButton}
              cartLabel={cartLabel}
            />
          ))}
          {/* Fill empty slots in the last row so cards don't stretch */}
          {row.length < cols &&
            Array.from({ length: cols - row.length }, (_, i) => (
              <View key={`empty-${i}`} style={{ width: cardWidth }} />
            ))}
        </View>
      ))}
    </View>
  );
});

// -------------------------------------------------------------------
// Main ProductsView — handles tabs + grid
// -------------------------------------------------------------------
const ProductsView = ({ tabs, settings }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Decide whether to show the tab strip.
  // Show it only when there are multiple tabs AND at least one has a non-empty title.
  const hasTitledTabs = tabs.length > 1 && tabs.some((t) => !!t.title);

  const currentTab = tabs[activeTab] || tabs[0];
  const products = currentTab ? currentTab.products : [];

  return (
    <View style={styles.container}>
      {hasTitledTabs && (
        <TabStrip
          tabs={tabs}
          activeIndex={activeTab}
          onSelect={setActiveTab}
        />
      )}
      <ProductGrid products={products} settings={settings} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  // Tab strip
  tabScroll: {
    marginBottom: 12,
  },
  tabContent: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 2,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  tabActive: {
    backgroundColor: '#1A1A1A',
  },
  tabText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  // Product grid
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    gap: CARD_GAP,
    justifyContent: 'flex-start',
    marginBottom: 0,
  },
});

export { gridColumnsFromStyle, CARD_GAP, USABLE_WIDTH };
export default ProductsView;

import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { Text, View } from 'tamagui';
import { XStack } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProductGrid from '../../modules/productGrid';
import CatalogTopTabs from './CatalogTopTabs';
import CatalogSidebar from './CatalogSidebar';
import CatalogItemGrid from './CatalogItemGrid';
import { getCategoryProducts } from '../../api/storefront';
import { colors } from '../../utils/theme';

/**
 * Catalog taxonomy.
 *
 * `categoryId` on each leaf item is a REAL brandwik backend category id, so
 * tapping a tile fetches that category's live products (see getCategoryProducts).
 * Grouping below is a pragmatic 3-tab arrangement of the populated backend
 * categories; adjust freely as the catalog grows.
 *
 * Shape: Array<{ id, name, categories: Array<{ id, name, items:
 *   Array<{ id, name, image, categoryId }> }> }>
 */
const CATALOG_DATA = [
  {
    id: 'electronics',
    name: 'Electronics',
    categories: [
      {
        id: 'electronics-all',
        name: 'Electronics',
        items: [
          { id: 'c-31', name: 'Electronics', image: '', categoryId: '31' },
          { id: 'c-32', name: 'Appliances', image: '', categoryId: '32' },
          { id: 'c-41', name: 'Audio & Headphones', image: '', categoryId: '41' },
          { id: 'c-50', name: 'Computers', image: '', categoryId: '50' },
          { id: 'c-80', name: 'Gadgets', image: '', categoryId: '80' },
          { id: 'c-92', name: 'Gaming', image: '', categoryId: '92' },
          { id: 'c-104', name: 'Mobile', image: '', categoryId: '104' },
          { id: 'c-118', name: 'Photo & Video', image: '', categoryId: '118' },
          { id: 'c-124', name: 'TVs', image: '', categoryId: '124' },
        ],
      },
    ],
  },
  {
    id: 'home',
    name: 'Home & Furniture',
    categories: [
      {
        id: 'home-all',
        name: 'Home & Furniture',
        items: [
          { id: 'c-450', name: 'Home & Furniture', image: '', categoryId: '450' },
          { id: 'c-451', name: 'Bathroom', image: '', categoryId: '451' },
          { id: 'c-467', name: 'Bedroom', image: '', categoryId: '467' },
          { id: 'c-476', name: 'Dining Room', image: '', categoryId: '476' },
          { id: 'c-485', name: 'Home Office', image: '', categoryId: '485' },
          { id: 'c-504', name: 'Living Room', image: '', categoryId: '504' },
          { id: 'c-512', name: 'Sofas', image: '', categoryId: '512' },
          { id: 'c-514', name: 'Lighting', image: '', categoryId: '514' },
          { id: 'c-540', name: 'Outdoor', image: '', categoryId: '540' },
          { id: 'c-750', name: 'Furniture', image: '', categoryId: '750' },
          { id: 'c-1144', name: 'Plant Decor', image: '', categoryId: '1144' },
        ],
      },
    ],
  },
  {
    id: 'beauty',
    name: 'Beauty & Fashion',
    categories: [
      {
        id: 'beauty-all',
        name: 'Beauty & Fashion',
        items: [
          { id: 'c-134', name: 'Fashion', image: '', categoryId: '134' },
          { id: 'c-387', name: 'Health & Beauty', image: '', categoryId: '387' },
          { id: 'c-389', name: 'Fragrance', image: '', categoryId: '389' },
          { id: 'c-399', name: 'Beauty', image: '', categoryId: '399' },
          { id: 'c-404', name: 'Skin Care', image: '', categoryId: '404' },
          { id: 'c-1079', name: 'Accessories', image: '', categoryId: '1079' },
        ],
      },
    ],
  },
];

export default function CatalogScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const categoryId = route.params?.categoryId;
  const categoryName = route.params?.categoryName;

  useLayoutEffect(() => {
    navigation.setOptions({ title: categoryName ?? 'Categories' });
  }, [navigation, categoryName]);

  const [activeGroupId, setActiveGroupId] = useState(CATALOG_DATA[0]?.id);

  const activeGroup = useMemo(
    () => CATALOG_DATA.find(g => g.id === activeGroupId) ?? CATALOG_DATA[0],
    [activeGroupId],
  );

  const [activeCategoryId, setActiveCategoryId] = useState(
    activeGroup?.categories?.[0]?.id,
  );

  // Live products for the category-listing mode. null = loading, [] = empty.
  const [products, setProducts] = useState(null);

  useEffect(() => {
    if (!categoryId) return;
    let alive = true;
    setProducts(null);
    getCategoryProducts(categoryId)
      .then(list => {
        if (alive) setProducts(list);
      })
      .catch(() => {
        if (alive) setProducts([]);
      });
    return () => {
      alive = false;
    };
  }, [categoryId]);

  const handleTopTabChange = nextId => {
    setActiveGroupId(nextId);
    const nextGroup = CATALOG_DATA.find(g => g.id === nextId);
    setActiveCategoryId(nextGroup?.categories?.[0]?.id);
  };

  const activeCategory = useMemo(
    () =>
      activeGroup?.categories?.find(c => c.id === activeCategoryId) ??
      activeGroup?.categories?.[0],
    [activeGroup, activeCategoryId],
  );

  const handleItemPress = item => {
    if (!item?.categoryId) return;
    navigation.push('catalog', {
      categoryId: item.categoryId,
      categoryName: item.name,
    });
  };

  // ---- Category listing mode (opened with a categoryId) ----
  if (categoryId) {
    if (products === null) {
      return (
        <View flex={1} alignItems="center" justifyContent="center" backgroundColor={colors.surface}>
          <ActivityIndicator size="large" color={colors.brand} />
        </View>
      );
    }
    if (!products.length) {
      return (
        <View flex={1} alignItems="center" justifyContent="center" padding={24} backgroundColor={colors.surface}>
          <Text color={colors.textSubtle} fontSize={14} textAlign="center">
            No products found in {categoryName ?? 'this category'}.
          </Text>
        </View>
      );
    }
    return (
      <ProductGrid
        key={categoryId}
        products={products}
        title={categoryName ?? ''}
        scroll={false}
      />
    );
  }

  // ---- Browse mode (top tabs + sidebar + item grid) ----
  return (
    <View flex={1} backgroundColor={colors.surface}>
      <CatalogTopTabs
        tabs={CATALOG_DATA.map(g => ({ id: g.id, name: g.name }))}
        activeId={activeGroupId}
        onChange={handleTopTabChange}
      />
      <XStack flex={1}>
        <CatalogSidebar
          categories={activeGroup?.categories ?? []}
          activeId={activeCategory?.id}
          onSelect={setActiveCategoryId}
        />
        <CatalogItemGrid
          items={activeCategory?.items ?? []}
          onItemPress={handleItemPress}
        />
      </XStack>
    </View>
  );
}

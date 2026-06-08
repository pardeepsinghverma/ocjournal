import React, { useLayoutEffect, useMemo, useState } from 'react';
import { View } from 'tamagui';
import { XStack } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import ProductGrid from '../../modules/productGrid';
import CatalogTopTabs from './CatalogTopTabs';
import CatalogSidebar from './CatalogSidebar';
import CatalogItemGrid from './CatalogItemGrid';
import { colors } from '../../utils/theme';

/**
 * Expected shape of the catalog data:
 *
 * CATALOG_DATA: Array<{
 *   id: string,              // top-tab id (e.g. 'men')
 *   name: string,            // top-tab label (e.g. 'MEN')
 *   categories: Array<{
 *     id: string,            // sidebar row id (e.g. 'topwear')
 *     name: string,          // sidebar row label (e.g. 'Topwear')
 *     items: Array<{
 *       id: string,          // grid cell id
 *       name: string,        // grid cell label (e.g. 'All T-Shirts')
 *       image: string,       // circular thumbnail url
 *       categoryId: string,  // target category for product listing
 *     }>,
 *   }>,
 * }>
 */
const CATALOG_DATA = [
  {
    id: 'men',
    name: 'Men',
    categories: [
      {
        id: 'men-topwear',
        name: 'Topwear',
        items: [
          { id: 'm-tw-1', name: 'All Topwear', image: 'https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-350x350f.jpg', categoryId: '34' },
          { id: 'm-tw-2', name: 'All T-Shirts', image: 'https://rukminim3.flixcart.com/image/388/494/xif0q/hand-messenger-bag/v/x/z/fashion-designer-custom-purses-ladies-bags-handbags-0082-hand-enriched-1-original-imaghq6mfcakugmu.jpeg', categoryId: '35' },
          { id: 'm-tw-3', name: 'All Shirts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '36' },
          { id: 'm-tw-4', name: 'Polo T-Shirts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '37' },
          { id: 'm-tw-5', name: 'Oversized T-shirts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '38' },
          { id: 'm-tw-6', name: 'Classic Fit T-shirts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '39' },
          { id: 'm-tw-7', name: 'Half Sleeve T-Shirts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '40' },
          { id: 'm-tw-8', name: 'Printed T-Shirts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '41' },
          { id: 'm-tw-9', name: 'Plain T-Shirts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '42' },
          { id: 'm-tw-10', name: 'Sleeveless T-Shirts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '43' },
        ],
      },
      { id: 'men-bottomwear', name: 'Bottomwear', items: [
        { id: 'm-bw-1', name: 'All Bottomwear', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '44' },
        { id: 'm-bw-2', name: 'Jeans', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '45' },
        { id: 'm-bw-3', name: 'Trousers', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '46' },
        { id: 'm-bw-4', name: 'Shorts', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '47' },
      ]},
      { id: 'men-winterwear', name: 'Winterwear', items: [
        { id: 'm-ww-1', name: 'Jackets', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '48' },
        { id: 'm-ww-2', name: 'Sweaters', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '49' },
      ]},
      { id: 'men-plus-size', name: 'Plus Size', items: [] },
      { id: 'men-fandom', name: 'Shop by Fandom', items: [] },
      { id: 'men-footwear', name: 'Footwear', items: [] },
      { id: 'men-innerwear', name: 'Innerwear & Loungewear', items: [] },
      { id: 'men-specials', name: 'Specials', items: [] },
      { id: 'men-accessories', name: 'Accessories', items: [] },
    ],
  },
  {
    id: 'women',
    name: 'Women',
    categories: [
      { id: 'women-ethnic', name: 'Ethnic', items: [
        { id: 'w-e-1', name: 'All Ethnic', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '50' },
        { id: 'w-e-2', name: 'Sarees', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '51' },
        { id: 'w-e-3', name: 'Kurtas', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '52' },
      ]},
      { id: 'women-western', name: 'Western', items: [
        { id: 'w-w-1', name: 'Dresses', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '53' },
        { id: 'w-w-2', name: 'Tops', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '54' },
      ]},
      { id: 'women-footwear', name: 'Footwear', items: [] },
      { id: 'women-accessories', name: 'Accessories', items: [] },
    ],
  },
  {
    id: 'accessories',
    name: 'Accessories',
    categories: [
      { id: 'acc-bags', name: 'Bags', items: [
        { id: 'a-b-1', name: 'Backpacks', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '60' },
        { id: 'a-b-2', name: 'Handbags', image: 'https://image-test-sa.fathersolution.com/fs/no_image-350x350f.jpg', categoryId: '61' },
      ]},
      { id: 'acc-watches', name: 'Watches', items: [] },
      { id: 'acc-jewelry', name: 'Jewelry', items: [] },
      { id: 'acc-eyewear', name: 'Eyewear', items: [] },
    ],
  },
];

/**
 * Dummy JSON shape consumed by <ProductGrid /> (legacy path, used when
 * the screen is opened with a `categoryId` route param). See
 * src/modules/productGrid for full rendering details.
 */
const FALLBACK_PRODUCTS = {
  '59': {
    product_id: '59',
    name: 'Zarikon Romanian bracelets for women, stainless steel, simple, engineering jewelry',
    thumb: 'https://rukminim3.flixcart.com/image/388/494/xif0q/hand-messenger-bag/v/x/z/fashion-designer-custom-purses-ladies-bags-handbags-0082-hand-enriched-1-original-imaghq6mfcakugmu.jpeg',
    thumb2x: 'https://image-test-sa.fathersolution.com/m/1/1541/0541/image/cache/catalog/stock-abstract-online-shop-logo-designs-template-illustration-graphic-of-smartphone-free-vector-700x700f.jpg',
    price: 'SR.12.34',
    tax: 'SR.12.34',
    special: false,
    quantity: '500',
    stock_status: 'In Stock',
    minimum: '1',
    rating: 0,
    labels: { 29: { type: 'custom', label: 'New', display: 'default' } },
    href: '#',
  },
};

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

  if (categoryId) {
    return (
      <ProductGrid
        key={categoryId}
        products={FALLBACK_PRODUCTS}
        title={categoryName ?? ''}
        scroll={false}
      />
    );
  }

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

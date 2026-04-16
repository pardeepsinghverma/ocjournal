import React from 'react'
import { Card, Image, Paragraph, Text, XStack, YStack } from 'tamagui'
import MSection from '../components/MSection'
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';
import { getPlaceholderImage } from '../utils/getImage';

const screenWidth = Dimensions.get('window').width;
const gap = 10;
const Cardwidth = screenWidth / 2 - gap / 2;

const ProductGridCard = ({ ProductGrid, scroll }) => {
  const width = scroll ? 160 : Cardwidth;
  const height = scroll ? 300 : 340;
  const imgWidth = width;
  const imgHeight = height - 90;
  const navigation = useNavigation();

  return (
    <Card
      onPress={() => navigation.navigate('productView', { productId: ProductGrid.id })}
      key={ProductGrid.id}
      height={height}
      width={width}
      bordered
      overflow='hidden'
    >
      
      {/* LABELS */}
      <XStack gap={4} flexWrap="wrap" position='absolute' top={0} left={0} zIndex={1}>

        {Object.values(ProductGrid.labels ?? {}).map((label, index) => (

          <Text
            key={index}
            fontSize={13}
            color={'#ffffff'}
            backgroundColor={'rgba(68, 68, 68, 0.8)'}
            paddingHorizontal={12}
            paddingVertical={6}
          >
            {label.label}
          </Text>

        ))}

      </XStack>

      <Image
        src={getPlaceholderImage(ProductGrid.image, imgWidth, imgHeight, 'Product')}
        width={imgWidth}
        height={imgHeight}
        backgroundColor={'#f5f5f5'}
        borderRadius="$4"
        objectFit='cover'
      />

      <Card.Footer padding={10} marginTop={0}>
        <YStack gap={0} height={100}>

          <Paragraph
            lineHeight={16}
            marginBottom={6}
            numberOfLines={2}
            fontSize={14}
            color={'#000000'}
          >
            {ProductGrid.name}
          </Paragraph>

          {/* PRICE */}
          <XStack gap={5} alignItems="center">

            <Paragraph
              marginBottom={0}
              numberOfLines={1}
              fontSize={14}
              fontWeight={600}
              color={'#000'}
            >
              {ProductGrid.price}
            </Paragraph>

            {ProductGrid.oldPrice && (
              <Paragraph
                marginBottom={0}
                numberOfLines={1}
                opacity={0.4}
                fontSize={14}
                textDecorationLine='line-through'
              >
                {ProductGrid.oldPrice}
              </Paragraph>
            )}

            {ProductGrid.special && (
              <Paragraph
                fontSize={14}
                color={'green'}
              >
                {ProductGrid.special}
              </Paragraph>
            )}

          </XStack>

        </YStack>
      </Card.Footer>

    </Card>
  )
}

const mapProducts = (productsData) => {

  if (!productsData || typeof productsData !== 'object') {
    return [];
  }

  return Object.values(productsData).map((product) => ({
    id: parseInt(product.product_id, 10),
    name: product.name,
    image: product.thumb,
    price: product.price,
    oldPrice: product.tax,
    special: product.special,
    labels: product.labels || {}
  }));
};

const ProductGrid = ({ products, title, scroll = true }) => {

  const mappedProducts = mapProducts(products);

  return (
    <MSection
      title={title ?? false}
      titleLevel={'4'}
      ScrollDirection={scroll ? 'horizontal' : false}
    >

      {mappedProducts.map((product) => (
        <ProductGridCard
          key={product.id}
          scroll={scroll}
          ProductGrid={product}
        />
      ))}

    </MSection>
  )
}

export default ProductGrid
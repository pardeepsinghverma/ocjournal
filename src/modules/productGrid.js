import React from 'react'
import { Button, Card, H2, H4, H6, Image, Paragraph, ScrollView, Text, View, XStack, YStack } from 'tamagui'
import MSection from '../components/MSection'
import { useNavigation } from '@react-navigation/native';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width; 
const gap = 10;
const Cardwidth = screenWidth / 2 - gap / 2;

const ProductGridCard = ({ ProductGrid, scroll }) => { 
  const width = scroll ? 160 : Cardwidth;
  const height = scroll ? 340 : 380;
  const navigation = useNavigation();
    return (
      <Card onPress={()=>{navigation.navigate('productView')}} key={ProductGrid.id} height={height} width={width} bordered overflow='hidden'>
        <Image
          src={ProductGrid.image}
          width={width}
          height={height - 140}
          backgroundColor={'#f5f5f5'}
          borderRadius="$4"
          objectFit='cover'
        />
        <Card.Footer padding={10} marginTop={0}>
          <YStack gap={0} height={100}>
            <Paragraph lineHeight={16} marginBottom={6} numberOfLines={2} fontSize={12} theme="alt2" color={'#000000'}>{ProductGrid.name}</Paragraph>
            {/* <Paragraph lineHeight={13} marginBottom={6} numberOfLines={1} fontSize={10} theme="alt2">{ProductGrid.description}</Paragraph> */}
            <XStack gap={5} alignItems="center">            
              <Paragraph lineHeight={13} marginBottom={6} numberOfLines={1} fontSize={13} fontWeight={600} color={'#000000'}>{ProductGrid.price}</Paragraph>
              <Paragraph lineHeight={13} marginBottom={6} numberOfLines={1} fontSize={9} textDecorationLine='line-through'>{ProductGrid.oldPrice}</Paragraph>
              <Paragraph lineHeight={13} marginBottom={6} numberOfLines={1} fontSize={10} color={'green'}>{ProductGrid.special}</Paragraph>
            </XStack>
            <Button width={width - 20} marginTop={5} onPress={()=>{navigation.navigate('checkoutNavigation')}}>Add to Cart</Button>
          </YStack>
        </Card.Footer>

      </Card>
    )
}

const mapProducts = (productsData) => {
  if (!productsData || typeof productsData !== 'object') {
    throw new Error('Invalid categories data');
  }


  // Transform the input data
  return Object.values(productsData).map((product) => (
    {
      id: parseInt(product.product_id, 10), 
      name: product.name, // Use the product name
      image: product.thumb, // Map the thumbnail as the image
      price: product.price, // Map the price
      specialPrice: product.special, // Map the special price
    }
  ));
};

const ProductGrid = ({ products, title, scroll = true }) => {
  // console.log(products);
  return (
    <MSection title={title ?? false} titleLevel={'4'} ScrollDirection={scroll ? 'horizontal' : false}> 
      {/* <Text>Product Grid</Text> */}
      {
        mapProducts(products).map((ProductGrid) => (
          <ProductGridCard key={ProductGrid.id} scroll={scroll} ProductGrid={ProductGrid} />
        ))
      }
    </MSection>
  )
}

export default ProductGrid
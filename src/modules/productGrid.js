import React from 'react'
import { Button, Card, H2, H4, H6, Image, Paragraph, ScrollView, Text, View, XStack, YStack } from 'tamagui'
import MSection from '../components/MSection'
import { useNavigation } from '@react-navigation/native';

const ProductGridCard = ({ ProductGrid }) => { 
  const navigation = useNavigation();
    return (
      <Card key={ProductGrid.id} height={340} width={160} bordered overflow='hidden'>
        <Image
          src="https://rukminim2.flixcart.com/image/850/1000/xif0q/t-shirt/q/v/0/s-cchenashgry-clothing-culture-original-imaghwmevpffnvsp.jpeg?q=90&crop=false"
          width={160}
          height={215}
          backgroundColor={'#f5f5f5'}
          borderRadius="$4"
          objectFit='cover'
        />
        <Card.Footer padding={10}>
          <YStack gap={0}>
            <Paragraph lineHeight={12} marginBottom={6} numberOfLines={1} fontSize={12} theme="alt2" color={'#000000'}>{ProductGrid.name}</Paragraph>
            <Paragraph lineHeight={13} marginBottom={6} numberOfLines={1} fontSize={10} theme="alt2">{ProductGrid.description}</Paragraph>
            <XStack gap={5} alignItems="center">            
              <Paragraph lineHeight={13} marginBottom={6} numberOfLines={1} fontSize={13} fontWeight={600} color={'#000000'}>{ProductGrid.specialPrice}</Paragraph>
              <Paragraph lineHeight={13} marginBottom={6} numberOfLines={1} fontSize={9} textDecorationLine='line-through'>{ProductGrid.oldPrice}</Paragraph>
              <Paragraph lineHeight={13} marginBottom={6} numberOfLines={1} fontSize={10} color={'green'}>{ProductGrid.oldPrice}</Paragraph>
            </XStack>
            <Button marginTop={5} onPress={()=>{navigation.navigate('productView')}}>Add to Cart</Button>
          </YStack>
        </Card.Footer>

      </Card>
    )
}

const ProductGrid = () => {
  const products = [
    {
      id: 1,
      name: "Classic T-Shirt",
      oldPrice: "₹20.00",
      specialPrice: "₹15.00",
      description: "A classic t-shirt made from 100% organic cotton.",
      wishlistStatus: true, // true if added to wishlist, false otherwise
      productLabel: "Buy 2 For ₹999",
      image: "https://example.com/classic-tshirt.jpg"
    },
    {
      id: 2,
      name: "Leather Jacket",
      oldPrice: "₹120.00",
      specialPrice: "₹99.00",
      description: "Genuine leather jacket with a modern fit.",
      wishlistStatus: false,
      productLabel: "Limited Stock",
      image: "https://example.com/leather-jacket.jpg"
    },
    {
      id: 3,
      name: "Running Shoes",
      oldPrice: "₹75.00",
      specialPrice: "₹60.00",
      description: "Lightweight and comfortable running shoes for daily wear.",
      wishlistStatus: true,
      productLabel: "Buy 2 For ₹999",
      image: "https://example.com/running-shoes.jpg"
    },
    {
      id: 4,
      name: "Summer Shorts",
      oldPrice: "₹25.00",
      specialPrice: "₹20.00",
      description: "Comfortable and breathable shorts for summer.",
      wishlistStatus: false,
      productLabel: "New Arrival",
      image: "https://example.com/summer-shorts.jpg"
    },
    {
      id: 5,
      name: "Denim Jeans",
      oldPrice: "₹50.00",
      specialPrice: "₹40.00",
      description: "Stylish denim jeans with a classic straight fit.",
      wishlistStatus: true,
      productLabel: "Discount Offer",
      image: "https://example.com/denim-jeans.jpg"
    }
  ];
  return (
    <MSection title={'Products'} titleLevel={'4'} ScrollDirection={'horizontal'}> 
      {products.map((ProductGrid) => (
        <ProductGridCard key={ProductGrid.id} ProductGrid={ProductGrid} />
      ))}
    </MSection>
  )
}

export default ProductGrid
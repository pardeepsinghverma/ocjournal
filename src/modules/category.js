import React from 'react'
import { Button, Card, H2, Image, Paragraph, ScrollView, Text, View, XStack } from 'tamagui'
import MTitle from '../components/MTitle'
import MSection from '../components/MSection'
import { useNavigation } from '@react-navigation/native'
import { getPlaceholderImage } from '../utils/getImage'

const CategoryCard = ({ category }) => { 
  const navigation = useNavigation();
    return (
      <Card onPress={()=>{navigation.navigate('catalog')}} key={category.id} height={240} width={160} bordered overflow='hidden'>
        {/* <Card.Header padded>
          <H2 color={'white'}>Sony A7IV</H2>
        </Card.Header> */}
        <Card.Footer padding={10}>
          <Paragraph fontWeight={600} color={'white'}>{category.name}</Paragraph>
          {/* <XStack flex={1} />
          <Button borderRadius="$10">Purchase</Button> */}
        </Card.Footer>
        <Card.Background>
          <Image
            objectFit='cover'
            alignSelf="center"
            height={240}
            width={160}
            src={getPlaceholderImage(category.image, 160, 240, 'Category')}
          />
        </Card.Background>
      </Card>
    )
}

const CategoryRounded = ({ category }) => { 
  const navigation = useNavigation();
    return (
      <View>
        <Image
          objectFit='cover'
          alignSelf="center"
          height={80}
          width={80}
          borderRadius={10}
          src={getPlaceholderImage(category.image, 80, 80, 'Category')}
        />
        <Text style={{ textAlign: 'center' }}>{category.name}</Text>  
      </View>
    )
}

const mapCategories = (categoriesData) => {
  if (!categoriesData || typeof categoriesData !== 'object') {
    throw new Error('Invalid categories data');
  }

  // Transform the input data
  return Object.values(categoriesData).map((category) => ({
    id: parseInt(category.category_id, 10), // Convert category_id to integer
    name: category.name, // Use the category name
    image: category.thumb, // Map the thumbnail as the image
    subCategories: [] // Add logic for subCategories if available
  }));
};

const style = 'rounded'
// const style = 'card'

const Category = ({ data }) => {
  // console.log(data);
  

    // const categories = [
    //     {
    //       id: 1,
    //       name: "Men's Clothing",
    //       image: "https://dummyimage.com/verticalrectangle",
    //       subCategories: [
    //         {
    //           id: 101,
    //           name: "Shirts",
    //           image: "https://example.com/mens-shirts.jpg"
    //         },
    //         {
    //           id: 102,
    //           name: "Trousers",
    //           image: "https://example.com/mens-trousers.jpg"
    //         },
    //         {
    //           id: 103,
    //           name: "Jackets",
    //           image: "https://example.com/mens-jackets.jpg"
    //         }
    //       ]
    //     },
    //     {
    //       id: 2,
    //       name: "Women's Clothing",
    //       image: "https://example.com/womens-clothing.jpg",
    //       subCategories: [
    //         {
    //           id: 201,
    //           name: "Dresses",
    //           image: "https://example.com/womens-dresses.jpg"
    //         },
    //         {
    //           id: 202,
    //           name: "Tops",
    //           image: "https://example.com/womens-tops.jpg"
    //         },
    //         {
    //           id: 203,
    //           name: "Skirts",
    //           image: "https://example.com/womens-skirts.jpg"
    //         }
    //       ]
    //     },
    //     {
    //       id: 3,
    //       name: "Kids' Clothing",
    //       image: "https://example.com/kids-clothing.jpg",
    //       subCategories: [
    //         {
    //           id: 301,
    //           name: "T-Shirts",
    //           image: "https://example.com/kids-tshirts.jpg"
    //         },
    //         {
    //           id: 302,
    //           name: "Shorts",
    //           image: "https://example.com/kids-shorts.jpg"
    //         },
    //         {
    //           id: 303,
    //           name: "Jackets",
    //           image: "https://example.com/kids-jackets.jpg"
    //         }
    //       ]
    //     }
    // ];
      
  
  // console.log(categories);
      
  return (
    <MSection title={'Category'} titleLevel={'4'} ScrollDirection={'horizontal'}> 
      {
        Object.keys(data).map((itemKey) => {
        const item = data[itemKey];
        return mapCategories(item.categories).map((category) => 
          style == "rounded" ? (
            <CategoryRounded key={category.id} category={category} />
          ) : (
            <CategoryCard key={category.id} category={category} />
          )
        )
        })
      }
    </MSection>
    )
}

export default Category

import React from 'react'
import { Text, View, XStack, YStack, Image } from 'tamagui'
import NoData from '../components/NoData'
import MTitle from '../components/MTitle'
import { ScrollView } from 'react-native'
import ProductGrid from '../modules/productGrid'
import productData from './../data/product.json'

  const PopularSearches = () => {

    const SearchTags = {
      popular_searches: [
        { title: "T-Shirts" },
        { title: "Vests" },
        { title: "Printed T-shirts" },
        { title: "Oversized T-shirts" },
        { title: "Joggers" },
        { title: "Anime" },
        { title: "New & Popular" },
        { title: "Customize" },
        { title: "Buy 3 for 1199" },
        { title: "Buy 3 for 999" },
        { title: "Buy 1 get 1" },
        { title: "Bags" },
        { title: "Sliders" }
      ]
    }

    return (
      <View>
        <MTitle title="Popular Searches" />

        <XStack flexWrap="wrap" gap="$2">
          {SearchTags.popular_searches.map((tag, index) => (
            <View
              key={index}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderWidth={1}
              borderColor="$gray5"
              borderRadius="$6"
            >
              <Text fontSize={14}>{tag.title}</Text>
            </View>
          ))}
        </XStack>
      </View>
    )
  }

  const PopularCurations = () => {

    const curations = {
      popular_curations: {
        featured: [
          {
            title: "Shop Now",
            image: "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740&q=80",
            action: "shop"
          },
          {
            title: "Live Now",
            image: "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740&q=80",
            action: "live"
          }
        ],
        collections: [
          {
            title: "New-arrivals",
            image: "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740&q=80",
            action: "new_arrivals"
          },
          {
            title: "Explore Now",
            image: "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740&q=80",
            action: "explore"
          },
          {
            title: "Bewakoof Air",
            image: "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740&q=80",
            action: "air_collection"
          },
          {
            title: "Heavy Duty",
            image: "https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?semt=ais_hybrid&w=740&q=80",
            action: "heavy_collection"
          }
        ]
      }
    }

    return (
      <View>
        <MTitle title="Popular Curations" />

        {/* Featured Cards */}
        <XStack gap="$3" marginBottom="$3">
          {curations.popular_curations.featured.map((item, index) => (
            <View
              key={index}
              flex={1}
              borderWidth={1}
              borderColor="$gray5"
              borderRadius="$6"
              padding="$3"
              alignItems="center"
            >
              <Image
                source={{ uri: item.image }}
                width={100}
                height={100}
                borderRadius={16}
                marginBottom="$2"
              />

              <Text fontSize={14} fontWeight="600">
                {item.title}
              </Text>
            </View>
          ))}
        </XStack>

        {/* Collection Cards */}
        <XStack flexWrap="wrap" gap="$3">
          {curations.popular_curations.collections.map((item, index) => (
            <View
              key={index}
              width="22.5%"
              borderWidth={1}
              borderColor="$gray5"
              borderRadius="$6"
              padding="$2"
              alignItems="center"
            >
              <Image
                source={{ uri: item.image }}
                width={60}
                height={60}
                borderRadius={12}
                marginBottom="$2"
              />

              <Text fontSize={12} textAlign="center">
                {item.title}
              </Text>
            </View>
          ))}
        </XStack>

      </View>
    )
  }

  const item = productData
  
  const ProductCategory1  = () => {
    return (
      <View>
        <MTitle title="Joggers" endLink={'catalog'} endTitle={'Expore All'}/>
        <ProductGrid key={"s"} products={item.products} title={""} scroll={true} />
      </View>
    )
  }

const SearchScreen = () => {
  return (
    <ScrollView style={{ flex: 1 }}>
      <YStack gap={14} padding={10}>
        <PopularSearches />
        <PopularCurations />
        <ProductCategory1 />
        <ProductCategory1 />
        {/* <NoData text={'No Search Found'} /> */}
      </YStack>
    </ScrollView>
  )
}

export default SearchScreen
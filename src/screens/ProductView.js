import React, { useState } from 'react';
import { Dimensions, ScrollView } from 'react-native';
// import Slider from '../modules/slider';
import MTitle from '../components/MTitle';
import Icon from 'react-native-vector-icons/FontAwesome';
import DescriptionAccordion from '../components/DescriptionAccordion';
import { Button, Image, Paragraph, Text, View, XStack, YStack } from 'tamagui';
import RenderProductOptions from '../components/options';
import Slider from '../components/Slider/Slider';
import Carousel from 'react-native-reanimated-carousel';
import { renderItem } from '../components/Slider/render-item';

// products.js
const products = [
  {
    id: 1,
    name: 'Official Peanuts Merchandise',
    description: 'Women Orange T-Shirt',
    price: 599,
    originalPrice: 1299,
    discount: 53,
    image: 'https://placehold.co/400x500',
    options: [
      {
        type: 'radio',
        label: 'Choose your size:',
        values: ['small', 'medium', 'large'],
      },
      {
        type: 'select',
        label: 'Choose a color:',
        values: [
          { label: 'Red', value: 'red' },
          { label: 'Blue', value: 'blue' },
          { label: 'Green', value: 'green' },
        ],
      },
    ],
  },
  // More products can be added here
];


const ProductView = () => {
  const product = products[0]; // Assuming we're rendering the first product
  const slides = [
    { image: product.image, text: product.name },
    { image: product.image, text: product.name },
  ];

  const [selectedOptions, setSelectedOptions] = useState({});

  // Function to handle option selection
  const handleOptionChange = (optionLabel, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [optionLabel]: value,
    }));
  };
  return (
    <ScrollView style={{ flex: 1 }}>
    
      <Carousel
        loop={true}
        width={Dimensions.get('window').width}
        height={400}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 1, // Prevent shrinking effect
          parallaxScrollingOffset: 10, // Controls the offset for alignment
          parallaxAdjacentItemScale: 1, // Slight scaling for adjacent items
        }}
        // itemWidth={Dimensions.get('window').width - 40 * 2}
        spacing={10}
        snapEnabled={true}
        pagingEnabled={true}
        autoPlayInterval={2000}
        autoPlay={false}
        quickSnap={true}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        data={slides}
        renderItem={({ item, index }) => (
            <Image src={'https://upload.wikimedia.org/wikipedia/commons/6/65/Product_Photography.jpg'} style={{ width: Dimensions.get('window').width, height: '100%' }} />
        )}
      />

      <YStack padding={14} marginBottom={10} backgroundColor={'#ffffff'}>
        <XStack gap={5} justifyContent="space-between">
          <MTitle title={product.name} marginBottom={0} />
          <Icon name="heart-o" size={24} color="#000000" />
        </XStack>

        <YStack gap={5}>
          <Paragraph fontSize={12} lineHeight={12}>{product.description}</Paragraph>
          <XStack gap={5} alignItems="center">
            <Paragraph lineHeight={16} marginBottom={6} numberOfLines={1} fontSize={16} fontWeight={600} color={'#000000'}>$ {product.price}</Paragraph>
            <Paragraph lineHeight={12} marginBottom={6} numberOfLines={1} fontSize={12} textDecorationLine='line-through'>$ {product.originalPrice}</Paragraph>
            <Paragraph lineHeight={15} marginBottom={6} numberOfLines={1} fontSize={14} color={'green'}>{product.discount}% OFF</Paragraph>
          </XStack>
          <Paragraph fontSize={12} lineHeight={12}>Inclusive All taxes</Paragraph>
        </YStack>
      </YStack>

      <YStack padding={14} marginBottom={10} backgroundColor={'#ffffff'}>
        {/* Render Product Options */}
        <RenderProductOptions
          options={product.options}
          selectedOptions={selectedOptions}
          handleOptionChange={handleOptionChange}
        />
      </YStack>
      
      <YStack padding={14} marginBottom={10} backgroundColor={'#ffffff'}>
        <DescriptionAccordion 
          title="1. Take a cold shower" 
          content="Cold showers can help reduce inflammation, relieve pain, improve circulation, lower stress levels, and reduce muscle soreness and fatigue." 
        />
      </YStack>

    </ScrollView>
  );
};

export default ProductView;

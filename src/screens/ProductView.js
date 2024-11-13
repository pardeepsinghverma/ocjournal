import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import Slider from '../modules/slider';
import MTitle from '../components/MTitle';
import Icon from 'react-native-vector-icons/FontAwesome';
import DescriptionAccordion from '../components/DescriptionAccordion';
import { Button, Paragraph, XStack, YStack } from 'tamagui';
import RenderProductOptions from '../components/options';

// products.js
const products = [
  {
    id: 1,
    name: 'Official Peanuts Merchandise',
    description: 'Women Orange T-Shirt',
    price: 599,
    originalPrice: 1299,
    discount: 53,
    imageUrl: 'https://placehold.co/400x500',
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
    { image: product.imageUrl, text: product.name },
    { image: product.imageUrl, text: product.name },
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
      <Slider
        slides={slides}
        showArrows={false}
        showBullets={false}
        bulletWithImage={true}
        slideStyle={1}
        autoSlide={false}
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

import React, { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { ProductCard } from '../components/products/card';
import ProductGrid from './productGrid';
import Banner from './banner';
import Slider from './slider';
import Category from './category';

const LayoutRenderer = () => {
    const slides = [
        { image: 'https://placehold.co/400x500', text: 'Slide 1' },
        { image: 'https://placehold.co/400x500', text: 'Slide 2' },
        { image: 'https://placehold.co/400x500', text: 'Slide 3' },
  ];
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
    <View>
      {/* {layoutData.rows.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row' }}>
          {row.columns.map((column, colIndex) => (
            <View key={colIndex} style={{ flex: 1 }}>
              {column.items.map((item) => {
                const ModuleComponent = componentMap[item.type];
                return ModuleComponent ? (
                  <ModuleComponent key={item.id} data={item.data} />
                ) : null;
              })}
            </View>
          ))}
        </View>
      ))} */}
          <Suspense fallback={<ActivityIndicator size={"large"} />}>
          <Slider
            slides={slides}
            autoSlide={true}
            slideInterval={5000}
            showArrows={true}
            showBullets={false}
            bulletWithImage={true}
          />
          </Suspense>
          <Suspense fallback={<ActivityIndicator size={"large"} />}><ProductGrid title={'Products'} products={products} /></Suspense>
          <Suspense fallback={<ActivityIndicator size={"large"} />}><Category /></Suspense>
          {/* <Suspense fallback={<ActivityIndicator size={"large"} />}><Banner /></Suspense> */}
    </View>
  );
};

export default LayoutRenderer;
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
          <Suspense fallback={<ActivityIndicator size={"large"} />}><ProductGrid /></Suspense>
          <Suspense fallback={<ActivityIndicator size={"large"} />}><Category /></Suspense>
          {/* <Suspense fallback={<ActivityIndicator size={"large"} />}><Banner /></Suspense> */}
    </View>
  );
};

export default LayoutRenderer;
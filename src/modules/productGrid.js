import React from 'react';
import { View, Image, Text } from 'react-native';

const ProductGrid = () => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {/* {data.products.map((product) => (
        <View key={product.id} style={{ width: '50%', padding: 10 }}>
          <Image source={{ uri: product.image }} style={{ width: 100, height: 100 }} />
          <Text>{product.name}</Text>
        </View>
      ))} */}
      <Text>Product Grid</Text>
    </View>
  );
};

export default ProductGrid;
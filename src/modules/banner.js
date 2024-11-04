import React from 'react';
import { View, Image, Text } from 'react-native';

const Banner = ({ data }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {/* {data.banners.map((banner) => (
        <View key={banner.id} style={{ width: '100%', padding: 10 }}>
          <Image source={{ uri: banner.image }} style={{ width: '100%', height: 200 }} />
        </View>
      ))} */}
      <Text>Banner</Text>
    </View>
  );
};

export default Banner;
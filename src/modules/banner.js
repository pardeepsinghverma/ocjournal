import React from 'react';
import { View, Image, Text } from 'react-native';

const Banners = ({ bannerData }) => {
  // console.log(bannerData);
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        <View key={bannerData.id} style={{ width: '100%', padding: 10 }}>
          <Image source={{ uri: bannerData.image }} style={{ width: '100%', height: 200 }} />
        </View>
    </View>
  );
};

const Banner = ({ data }) => {
  return (
    Object.keys(data).map((itemKey) => {
      const item = data[itemKey];
      // console.log(data[itemKey]);
      return <Banners key={itemKey} bannerData={item} />
  })
    // <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
    //   {/* {data.banners.map((banner) => (
    //     <View key={banner.id} style={{ width: '100%', padding: 10 }}>
    //       <Image source={{ uri: banner.image }} style={{ width: '100%', height: 200 }} />
    //     </View>
    //   ))} */}
    //   <Text>Banner</Text>
    // </View>
  );
};

export default Banner;
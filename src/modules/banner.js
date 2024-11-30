import React from 'react';
import { View, ImageBackground, Text, StyleSheet } from 'react-native';
import getScaledDimensions from '../utils/getScaledDimensions';

const Banners = ({ bannerData, imageDimensions }) => {
  const { width, height } = getScaledDimensions(imageDimensions.width, imageDimensions.height);

  return (
    <View style={{ width, height, margin: 5 }}>
      <ImageBackground 
        source={{ uri: bannerData.image }} 
        style={[styles.imageBackground, { width, height }]}
        imageStyle={{ borderRadius: 10 }} // Optional: Add rounded corners
      >
        <Text style={styles.text}>{bannerData.title}</Text>
        <Text style={styles.text}>{bannerData.title2}</Text>
        <Text style={styles.text}>{bannerData.title3}</Text>
      </ImageBackground>
    </View>
  );
};

const Banner = ({ data, options }) => {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {Object.keys(data).map((itemKey) => {
        const item = data[itemKey];
        return (
          <Banners 
            key={itemKey} 
            bannerData={item} 
            imageDimensions={options.imageDimensions} 
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    justifyContent: 'center', // Center text vertically
    alignItems: 'center', // Center text horizontally
  },
  text: {
    color: 'white', // Text color
    fontSize: 18, // Adjust font size as needed
    fontWeight: 'bold', // Bold text
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow for better contrast
    textShadowOffset: { width: -1, height: 1 }, // Shadow position
    textShadowRadius: 5, // Shadow blur
    paddingHorizontal: 10, // Padding for text
    textAlign: 'center', // Center align text
  },
});

export default Banner;

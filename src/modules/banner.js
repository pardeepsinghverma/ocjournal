import React from 'react';
import { View, ImageBackground, Text, StyleSheet, useWindowDimensions } from 'react-native';
import getScaledDimensions from '../utils/getScaledDimensions';
import { getPlaceholderImage } from '../utils/getImage';

const Banners = ({ bannerData, imageDimensions, perRow, spacing }) => {
  const { width, height } = getScaledDimensions(
    imageDimensions.width, 
    imageDimensions.height, 
    perRow, 
    spacing
  );
  
  return (
    <View style={{ width, height }}>
      <ImageBackground 
        source={{ uri: getPlaceholderImage(bannerData.image, width, height, 'Banner') }} 
        style={[styles.imageBackground, { width, height }]}
        imageStyle={{ borderRadius: 8 }} // Optional: Add rounded corners
      >
        <Text style={styles.text}>{bannerData.title}</Text>
        <Text style={styles.text}>{bannerData.title2}</Text>
        <Text style={styles.text}>{bannerData.title3}</Text>
      </ImageBackground>
    </View>
  );
};

const resolveItemsPerRow = (itemsPerRow, windowWidth) => {
  if (!itemsPerRow || !itemsPerRow.c0) {
    return { items: 1, spacing: 10 };
  }

  const c0 = itemsPerRow.c0;

  // Case 1: c0 is an array
  if (Array.isArray(c0)) {
    const config = c0[0] || {};
    return {
      items: parseInt(config.items) || 1,
      spacing: parseInt(config.spacing) || 10
    };
  }

  // Case 2: c0 is an object with max-width breakpoints
  if (typeof c0 === 'object') {
    // Collect all numeric keys greater than 0
    const numericKeys = Object.keys(c0)
      .map(Number)
      .filter(key => key > 0)
      .sort((a, b) => a - b); // Sort ascending (760, 1080...)

    // Find the smallest key that is >= current width
    for (const breakpoint of numericKeys) {
      if (windowWidth <= breakpoint) {
        const config = c0[breakpoint.toString()];
        return {
          items: parseInt(config.items) || 1,
          spacing: parseInt(config.spacing) || 10
        };
      }
    }

    // Fallback to the default "0" configuration if width exceeds all breakpoints
    const defaultConfig = c0["0"] || {};
    return {
      items: parseInt(defaultConfig.items) || 1,
      spacing: parseInt(defaultConfig.spacing) || 10
    };
  }

  return { items: 1, spacing: 10 };
};

const Banner = ({ data, options }) => {
  const { width: windowWidth } = useWindowDimensions();
  const { items: perRow, spacing } = resolveItemsPerRow(options.itemsPerRow, windowWidth);

  return (
    <View style={{ 
      flexDirection: 'row', 
      flexWrap: 'wrap', 
      justifyContent: 'flex-start',
      columnGap: spacing,
      rowGap: spacing,
      marginVertical: 10 
    }}>
      {Object.keys(data).map((itemKey) => {
        const item = data[itemKey];
        return (
          <Banners 
            key={itemKey} 
            bannerData={item} 
            imageDimensions={options.imageDimensions} 
            perRow={perRow}
            spacing={spacing}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    justifyContent: 'flex-end', // Center text vertically
    alignItems: 'flex-start', // Center text horizontally
  },
  text: {
    color: 'white', // Text color
    fontSize: 16, // Adjust font size as needed
    fontWeight: 'bold', // Bold text
    textShadowColor: 'rgba(0, 0, 0, 0.75)', // Shadow for better contrast
    textShadowOffset: { width: -1, height: 1 }, // Shadow position
    textShadowRadius: 5, // Shadow blur
    paddingHorizontal: 10, // Padding for text
    textAlign: 'left', // Center align text
  },
});

export default Banner;

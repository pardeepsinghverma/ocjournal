import React from 'react';
import { View, XStack, YStack, Text, Card, Image } from 'tamagui';
import { Dimensions } from 'react-native';
import { getPlaceholderImage } from '../utils/getImage';

const screenWidth = Dimensions.get('window').width;

const InfoBlocks = ({ data, options }) => {
  if (!options || !options.status) return null;

  const items = Object.values(data || {});
  
  return (
    <XStack 
      marginVertical={15} 
      gap={10} 
      flexWrap="wrap" 
      justifyContent="space-between"
    >
      {items.map((item, index) => (
        <View 
          key={item.id || index} 
          width={(screenWidth - 48) / 2} // 2 items per row minus padding
          backgroundColor="$gray2"
          padding={12}
          borderRadius={8}
          marginBottom={10}
        >
          <YStack gap={4}>
             {/* Placeholder for Icon - Using the global placeholder utility */}
            <Image 
              src={getPlaceholderImage(null, 24, 24, 'F')} 
              width={24} 
              height={24} 
              borderRadius={12} 
              marginBottom={4} 
            />
            
            <Text fontWeight="bold" fontSize={14} color="$gray12">
              {item.title}
            </Text>
            {item.content ? (
              <Text fontSize={12} color="$gray10" numberOfLines={2}>
                {item.content}
              </Text>
            ) : null}
          </YStack>
        </View>
      ))}
    </XStack>
  );
}

export default InfoBlocks;

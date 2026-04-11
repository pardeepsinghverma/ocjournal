import React from 'react';
import { Button, Text, Image, YStack, View } from 'tamagui';

// Radio Button Component using Tamagui
const RadioButton = ({ label, selected, onPress, image }) => {
  if (image) {
    return (
      <YStack 
        alignItems="center" 
        gap={4} 
        onPress={onPress}
      >
        <View
          borderWidth={2}
          borderColor={selected ? '#000000' : 'transparent'}
          borderRadius={8}
          padding={2}
        >
          <Image
            source={{ uri: image }}
            width={60}
            height={60}
            borderRadius={6}
            backgroundColor="#f5f5f5"
          />
        </View>
        <Text fontSize={12} color={selected ? '#000000' : '#888'}>{label}</Text>
      </YStack>
    );
  }

  return (
    <Button
      backgroundColor={selected ? '#000000' : 'transparent'}
      borderWidth={1}
      borderColor={selected ? '#000000' : '#000000'}
      borderRadius={8}
      paddingHorizontal={16}
      paddingVertical={10}
      height="auto"
      onPress={onPress}
      hoverStyle={{
        backgroundColor: selected ? '#000000' : 'transparent',
      }}
    >
      <Text color={selected ? '#ffffff' : '#000000'} fontSize={14}>{label}</Text>
    </Button>
  );
};

export default RadioButton;

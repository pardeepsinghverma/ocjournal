import React from 'react';
import { Button, Text } from 'tamagui';
// import { Button, Text } from 'tamagui';
// import { Check } from '@tamagui/lucide-icons';

// Radio Button Component using Tamagui
const RadioButton = ({ label, selected, onPress }) => {
  return (
    <Button
      backgroundColor={selected ? '#000000' : 'transparent'}
      borderWidth={1}
      borderColor={selected ? '#000000' : '#000000'}
      borderRadius={8}
      padding={10}
      onPress={onPress}
      hoverStyle={{
        backgroundColor: selected ? '#000000' : 'transparent',
        borderColor: selected ? '#000000' : '#000000'
      }}
      focusStyle={{
        backgroundColor: selected ? '#000000' : 'transparent',
        borderColor: selected ? '#000000' : '#000000'
      }}
      pressStyle={{
        backgroundColor: selected ? '#000000' : 'transparent',
        borderColor: selected ? '#000000' : '#000000'
      }}
    >
      {/* <Check size={16} color={selected ? 'black' : 'transparent'} /> */}
      <Text color={selected ? '#ffffff' : '#000000'} fontSize={14}>{label}</Text>
    </Button>
  );
};

export default RadioButton;

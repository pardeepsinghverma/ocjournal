import React from 'react';
import { Button, Text } from 'tamagui';
// import { Button, Text } from 'tamagui';
// import { Check } from '@tamagui/lucide-icons';

// Radio Button Component using Tamagui
const RadioButton = ({ label, selected, onPress }) => {
  return (
    <Button
      backgroundColor={selected ? 'yellow' : 'transparent'}
      borderWidth={1}
      borderColor="#000"
      borderRadius={8}
      padding={12}
      onPress={onPress}
      hoverStyle={{ backgroundColor: '#f0f0f0' }}
      focusStyle={{ backgroundColor: '#f0f0f0' }}
    >
      {/* <Check size={16} color={selected ? 'black' : 'transparent'} /> */}
      <Text fontSize={14}>{label}</Text>
    </Button>
  );
};

export default RadioButton;

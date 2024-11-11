import React from 'react';
import { Paragraph, XStack, YStack } from 'tamagui';
import RadioButton from './RadioButton';
import SelectDropdown from './SelectDropdown'; // Make sure this import is correct

const RenderProductOptions = ({ options, selectedOptions, handleOptionChange }) => {
  return options?.map((option, index) => {
    if (option.type === 'radio') {
      return (
        <YStack gap={5} marginTop={10} key={index}>
          <Paragraph>{option.label}</Paragraph>
          <XStack gap={5}>
            {option.values.map((value) => (
              <RadioButton
                key={value}
                label={value.charAt(0).toUpperCase() + value.slice(1)}
                selected={selectedOptions[option.label] === value}
                onPress={() => handleOptionChange(option.label, value)}
              />
            ))}
          </XStack>
        </YStack>
      );
    }
    else if (option.type === 'select') {
      return (
        <YStack gap={5} marginTop={10} key={index}>
          <Paragraph>{option.label}</Paragraph>
          <SelectDropdown
            options={option?.values}
            selectedOption={selectedOptions[option?.label]}
            onSelect={(value) => handleOptionChange(option?.label, value)}
          />
        </YStack>
      );
    }
  });
};

export default RenderProductOptions;

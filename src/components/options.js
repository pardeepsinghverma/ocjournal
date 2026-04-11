import React from 'react';
import { Paragraph, XStack, YStack } from 'tamagui';
import RadioButton from './RadioButton';
import SelectDropdown from './SelectDropdown'; // Make sure this import is correct

const RenderProductOptions = ({ options, selectedOptions, handleOptionChange }) => {
  return options?.map((option, index) => {
    const optionName = option.name;
    const values = option.product_option_value || [];

    if (option.type === 'radio' || option.type === 'checkbox') {
      return (
        <YStack gap={5} marginTop={10} key={option.product_option_id || index}>
          <Paragraph fontWeight="600">{optionName}</Paragraph>
          <XStack gap={8} flexWrap="wrap">
            {values.map((value) => (
              <RadioButton
                key={value.product_option_value_id}
                label={value.name}
                image={value.image}
                selected={
                  option.type === 'checkbox'
                    ? selectedOptions[optionName]?.includes(value.name)
                    : selectedOptions[optionName] === value.name
                }
                onPress={() => {
                  if (option.type === 'checkbox') {
                    const current = selectedOptions[optionName] || [];
                    const next = current.includes(value.name)
                      ? current.filter(v => v !== value.name)
                      : [...current, value.name];
                    handleOptionChange(optionName, next);
                  } else {
                    handleOptionChange(optionName, value.name);
                  }
                }}
              />
            ))}
          </XStack>
        </YStack>
      );
    }
    else if (option.type === 'select') {
      const selectOptions = values.map(v => ({ label: v.name, value: v.name }));
      return (
        <YStack gap={5} marginTop={10} key={option.product_option_id || index}>
          <Paragraph fontWeight="600">{optionName}</Paragraph>
          <SelectDropdown
            options={selectOptions}
            selectedOption={selectedOptions[optionName]}
            onSelect={(value) => handleOptionChange(optionName, value)}
          />
        </YStack>
      );
    }
    return null;
  });
};

export default RenderProductOptions;

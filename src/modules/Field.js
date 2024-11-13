import React from 'react';
import { Input, Label, Stack, Text } from 'tamagui';
import SelectDropdown from '../components/SelectDropdown';

const Field = ({ name, label, type, options = [], input, error }) => {

    // console.log(input)
  return (
    <Stack>
      <Label marginBottom={0} htmlFor={name}>{label}</Label>
      {type === 'text' && (
        <Input
          id={name}
          name={name}
          type="text"
          placeholder={`Enter your ${label}`}
          value={input.value}         // Bind the value from Final Form
          onChangeText={input.onChange} // Use onChangeText for text inputs in RN
        />
      )}
      {type === 'selectbox' && (
        <SelectDropdown 
          options={options}
          selectedOption={input.value}   // Bind the value from Final Form
          onSelect={input.onChange}      // Pass Final Form's onChange handler
        />
      )}
      {error && <Text color="red">{error}</Text>}
    </Stack>
  );
};

export default Field;

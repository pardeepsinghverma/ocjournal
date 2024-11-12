import React from 'react';
import { Input, Label, Select, Stack, Text } from 'tamagui';

const Field = ({ name, label, type, validation, options = [], error }) => {
  return (
    <Stack mb="$4">
      <Label htmlFor={name}>{label}</Label>
      {type === 'text' && (
        <Input
          id={name}
          name={name}
          type="text"
          placeholder={`Enter your ${label}`}
        />
      )}
      {type === 'selectbox' && (
        <Select id={name} name={name}>
          {options.map((option, index) => (
            <Select.Item key={index} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select>
      )}
      {error && <Text color="red">{error}</Text>}
    </Stack>
  );
};

export default Field;

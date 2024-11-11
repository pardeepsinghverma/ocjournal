import React, { useEffect, useState } from 'react';
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Adapt, Select, Sheet, YStack, LinearGradient } from 'tamagui';

const SelectDropdown = ({ options, selectedOption, onSelect }) => {
  const [value, setValue] = useState(selectedOption || options[0]?.value);

  useEffect(() => {
    if (selectedOption !== value) {
      setValue(selectedOption);
    }
  }, [selectedOption]);

  return (
    <YStack>
      <Select
        value={value}
        onValueChange={(val) => {
          setValue(val);
          onSelect(val);
        }}
        disablePreventBodyScroll
      >
        <Select.Trigger iconAfter={ChevronDown}>
          <Select.Value placeholder="Select a color" />
        </Select.Trigger>

        <Adapt when="sm" platform="touch">
          <Sheet modal dismissOnSnapToBottom>
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
          </Sheet>
        </Adapt>

        <Select.Content zIndex={200000}>
          <Select.ScrollUpButton>
            <ChevronUp size={20} />
          </Select.ScrollUpButton>
          <Select.Viewport minWidth={200}>
            {options.map((item) => (
              <Select.Item key={item.value} value={item.value}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
          <Select.ScrollDownButton>
            <ChevronDown size={20} />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select>
    </YStack>
  );
};

export default SelectDropdown;

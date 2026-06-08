import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Image, Text, View, XStack, YStack } from 'tamagui';
import { Bell } from '@tamagui/lucide-icons';
import SelectDropdown from './SelectDropdown';
import { colors, radii } from '../utils/theme';

const isAvailable = (value) => {
  if (value == null) return true;
  if (value.available === false) return false;
  if (value.disabled === true) return false;
  if (value.in_stock === false) return false;
  return true;
};

const valueHasImage = (values = []) => values.some((v) => !!v?.image);

const Tile = ({ label, selected, disabled, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={disabled ? undefined : onPress}
  >
    <View
      minWidth={58}
      paddingHorizontal={14}
      paddingVertical={10}
      borderRadius={radii.sm}
      borderWidth={1}
      borderColor={selected ? colors.text : colors.border}
      backgroundColor={selected ? colors.text : colors.surface}
    >
      <Text
        textAlign="center"
        fontWeight="600"
        fontSize={14}
        color={selected ? colors.surface : disabled ? colors.textSubtle : colors.text}
        textDecorationLine={disabled ? 'line-through' : 'none'}
      >
        {label}
      </Text>
    </View>
  </TouchableOpacity>
);

const ImageTile = ({ label, image, selected, disabled, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={disabled ? undefined : onPress}
  >
    <YStack alignItems="center" gap={4}>
      <View
        width={64}
        height={64}
        borderRadius={radii.md}
        borderWidth={selected ? 2 : 1}
        borderColor={selected ? colors.text : colors.border}
        overflow="hidden"
        opacity={disabled ? 0.4 : 1}
      >
        <Image source={{ uri: image }} width={64} height={64} objectFit="cover" />
      </View>
      <Text
        fontSize={12}
        color={disabled ? colors.textSubtle : colors.text}
        textDecorationLine={disabled ? 'line-through' : 'none'}
      >
        {label}
      </Text>
    </YStack>
  </TouchableOpacity>
);

const OptionsSelector = ({
  options,
  selectedOptions,
  handleOptionChange,
  showNotifyMe = true,
  sizeGuideLink,
  onSizeGuidePress,
  onNotifyPress,
}) => {
  if (!Array.isArray(options) || options.length === 0) return null;

  return (
    <YStack gap={18}>
      {options.map((option, optionIndex) => {
        const optionName = option.name;
        const values = option.product_option_value || [];
        const useImages = valueHasImage(values);
        const currentValue = selectedOptions?.[optionName];
        const isSize = /size/i.test(optionName || '');

        if (option.type === 'radio' || option.type === 'checkbox') {
          return (
            <YStack key={option.product_option_id || optionIndex} gap={10}>
              <XStack justifyContent="space-between" alignItems="center">
                <Text fontWeight="700" fontSize={15} color={colors.text}>
                  {isSize ? `Select ${optionName}` : optionName}
                </Text>
                {isSize && (sizeGuideLink || onSizeGuidePress) ? (
                  <TouchableOpacity onPress={onSizeGuidePress}>
                    <Text fontSize={13} color="#1565c0" fontWeight="600">
                      Size guide ›
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </XStack>

              <XStack gap={10} flexWrap="wrap">
                {values.map((value) => {
                  const disabled = !isAvailable(value);
                  const selected = option.type === 'checkbox'
                    ? Array.isArray(currentValue) && currentValue.includes(value.name)
                    : currentValue === value.name;

                  const onPress = () => {
                    if (option.type === 'checkbox') {
                      const current = Array.isArray(currentValue) ? currentValue : [];
                      const next = current.includes(value.name)
                        ? current.filter((v) => v !== value.name)
                        : [...current, value.name];
                      handleOptionChange(optionName, next);
                    } else {
                      handleOptionChange(optionName, value.name);
                    }
                  };

                  return useImages ? (
                    <ImageTile
                      key={value.product_option_value_id}
                      label={value.name}
                      image={value.image}
                      selected={selected}
                      disabled={disabled}
                      onPress={onPress}
                    />
                  ) : (
                    <Tile
                      key={value.product_option_value_id}
                      label={value.name}
                      selected={selected}
                      disabled={disabled}
                      onPress={onPress}
                    />
                  );
                })}
              </XStack>

              {isSize && showNotifyMe ? (
                <XStack alignItems="center" gap={6} marginTop={2}>
                  <Text fontSize={13} color={colors.text}>
                    Size not available?
                  </Text>
                  <TouchableOpacity onPress={onNotifyPress}>
                    <XStack alignItems="center" gap={4}>
                      <Text fontSize={13} color="#1565c0" fontWeight="600">
                        Notify me
                      </Text>
                      <Bell size={14} color="#1565c0" />
                    </XStack>
                  </TouchableOpacity>
                </XStack>
              ) : null}
            </YStack>
          );
        }

        if (option.type === 'select') {
          const selectOptions = values.map((v) => ({ label: v.name, value: v.name }));
          return (
            <YStack key={option.product_option_id || optionIndex} gap={8}>
              <Text fontWeight="700" fontSize={15} color={colors.text}>
                {optionName}
              </Text>
              <SelectDropdown
                options={selectOptions}
                selectedOption={currentValue}
                onSelect={(val) => handleOptionChange(optionName, val)}
              />
            </YStack>
          );
        }

        return null;
      })}
    </YStack>
  );
};

export default OptionsSelector;

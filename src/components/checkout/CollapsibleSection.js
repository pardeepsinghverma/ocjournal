import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View, XStack, YStack } from 'tamagui';
import { ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { colors, radii } from '../../utils/theme';

const CollapsibleSection = ({
  title,
  titleRight,
  defaultOpen = false,
  children,
  surface = colors.surface,
  noBorder = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <View
      backgroundColor={surface}
      borderRadius={radii.md}
      borderWidth={noBorder ? 0 : 1}
      borderColor={colors.border}
      overflow="hidden"
    >
      <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen((v) => !v)}>
        <XStack
          paddingHorizontal={14}
          paddingVertical={14}
          alignItems="center"
          justifyContent="space-between"
        >
          <XStack alignItems="center" gap={8} flex={1}>
            <Text fontSize={15} fontWeight="700" color={colors.text} numberOfLines={1}>
              {title}
            </Text>
            {titleRight ? <View>{titleRight}</View> : null}
          </XStack>
          {open ? (
            <ChevronUp size={18} color={colors.text} />
          ) : (
            <ChevronDown size={18} color={colors.text} />
          )}
        </XStack>
      </TouchableOpacity>

      {open ? (
        <YStack paddingHorizontal={14} paddingBottom={14}>
          {children}
        </YStack>
      ) : null}
    </View>
  );
};

export default CollapsibleSection;

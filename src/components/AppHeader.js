import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Text, View, XStack } from 'tamagui';
import IoChevronBackOutline from './icons/IoChevronBackOutline';
import { colors } from '../utils/theme';

const AppHeader = ({
  title,
  subtitle,
  onBack,
  rightSlot,
  showBack = true,
  background = colors.surface,
}) => {
  const navigation = useNavigation();

  const handleBack = () => {
    if (onBack) return onBack();
    if (navigation.canGoBack()) navigation.goBack();
  };

  return (
    <View
      backgroundColor={background}
      paddingHorizontal={12}
      paddingVertical={12}
      borderBottomWidth={1}
      borderBottomColor={colors.borderSoft}
    >
      <XStack alignItems="center" gap={8}>
        {showBack ? (
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <IoChevronBackOutline size={24} color={colors.text} />
          </TouchableOpacity>
        ) : null}

        <View flex={1} flexDirection="column">
          <Text
            fontSize={17}
            fontWeight="700"
            color={colors.text}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text fontSize={12} color={colors.textMuted} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        {rightSlot ? <View>{rightSlot}</View> : null}
      </XStack>
    </View>
  );
};

export default AppHeader;

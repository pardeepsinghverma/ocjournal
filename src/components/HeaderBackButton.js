import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IoChevronBackOutline from './icons/IoChevronBackOutline';
import { colors } from '../utils/theme';

const HeaderBackButton = ({ size = 24, color = colors.text, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) return onPress();
    if (navigation.canGoBack()) navigation.goBack();
  };

  if (!onPress && !navigation.canGoBack()) return null;

  return (
    <TouchableOpacity
      onPress={handlePress}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ paddingRight: 8 }}
    >
      <IoChevronBackOutline size={size} color={color} />
    </TouchableOpacity>
  );
};

export default HeaderBackButton;

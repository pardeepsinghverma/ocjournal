import React from 'react';
import { Share, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { XStack } from 'tamagui';
import {
  Search,
  Share2,
  Bell,
  Heart,
  ShoppingCart,
} from '@tamagui/lucide-icons';

/**
 * HeaderActions Component
 * 
 * @param {Array} actions - List of actions to show: ['search', 'share', 'bell', 'wishlist', 'cart']
 * @param {string} color - Icon color (default: #000)
 * @param {number} size - Icon size (default: 22)
 * @param {object} shareData - Data for Share API { title, message, url }
 * @param {boolean} isWishlisted - Whether the heart icon should be filled
 * @param {function} onWishlistPress - Optional override for wishlist action
 */
const HeaderActions = ({
  actions = [],
  color = '#000',
  size = 22,
  shareData = {},
  isWishlisted = false,
  onWishlistPress,
}) => {
  const navigation = useNavigation();

  const handleAction = async (type) => {
    switch (type) {
      case 'search':
        navigation.navigate('search');
        break;
      case 'share':
        try {
          await Share.share({
            title: shareData.title || 'Check this out!',
            message: shareData.message || 'Check out this product on OC Journal',
            url: shareData.url,
          });
        } catch (error) {
          console.error('Error sharing:', error.message);
        }
        break;
      case 'bell':
        navigation.navigate('notification');
        break;
      case 'wishlist':
        if (onWishlistPress) {
          onWishlistPress();
        } else {
          navigation.navigate('wishlist');
        }
        break;
      case 'cart':
        navigation.navigate('cart');
        break;
      default:
        break;
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case 'search':
        return <Search size={size} color={color} />;
      case 'share':
        return <Share2 size={size} color={color} />;
      case 'bell':
        return <Bell size={size} color={color} />;
      case 'wishlist':
        return (
          <Heart
            size={size}
            color={isWishlisted ? '#ff0000' : color}
            fill={isWishlisted ? '#ff0000' : 'transparent'}
          />
        );
      case 'cart':
        return <ShoppingCart size={size} color={color} />;
      default:
        return null;
    }
  };

  return (
    <XStack marginEnd={10} gap={20} alignItems="center">
      {actions.map((action, index) => (
        <TouchableOpacity
          key={`${action}-${index}`}
          onPress={() => handleAction(action)}
          activeOpacity={0.7}
        >
          {renderIcon(action)}
        </TouchableOpacity>
      ))}
    </XStack>
  );
};

export default HeaderActions;

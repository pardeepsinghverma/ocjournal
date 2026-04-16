import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View } from 'tamagui';
import { ShoppingCart } from '@tamagui/lucide-icons';
import { clearCartNotification } from '../store/cartSlice';

const CartToast = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.cart?.notification);

  useEffect(() => {
    if (!notification) return undefined;
    const t = setTimeout(() => dispatch(clearCartNotification()), 2000);
    return () => clearTimeout(t);
  }, [notification, dispatch]);

  if (!notification) return null;

  return (
    <View
      position="absolute"
      bottom={90}
      left={16}
      right={16}
      zIndex={9999}
      backgroundColor="#323232"
      borderRadius={10}
      paddingVertical={12}
      paddingHorizontal={16}
      flexDirection="row"
      alignItems="center"
      gap={10}
      elevation={6}
      shadowColor="#000"
      shadowOpacity={0.25}
      shadowRadius={6}
      shadowOffset={{ width: 0, height: 3 }}
    >
      <ShoppingCart size={18} color="#ffffff" />
      <Text color="#ffffff" fontSize={14} flex={1} numberOfLines={2}>
        {notification.message}
      </Text>
    </View>
  );
};

export default CartToast;

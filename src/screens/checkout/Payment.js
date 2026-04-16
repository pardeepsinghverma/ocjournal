import React from 'react';
import { View } from 'react-native';
import { Button, Text, YStack } from 'tamagui';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, selectCartSubtotal } from '../../store/cartSlice';
import { placeOrder } from '../../store/authSlice';

const Payment = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items ?? []);
  const addresses = useSelector((state) => state.auth?.addresses ?? []);
  const subtotal = useSelector(selectCartSubtotal);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    dispatch(placeOrder({
      items: items.map((i) => ({
        key: i.key,
        productId: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        priceValue: i.priceValue,
        selectedOptions: i.selectedOptions,
        quantity: i.quantity,
      })),
      address: defaultAddress,
      subtotal,
      total: subtotal,
    }));
    dispatch(clearCart());
    navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          { name: 'main' },
          { name: 'myorders' },
        ],
      })
    );
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <YStack gap={16}>
        <Text fontSize={20} fontWeight="600">Payment</Text>
        <Text color="#555">Select a payment method (placeholder).</Text>
        <Text color="#555">Items: {items.length} · Total: SAR {subtotal.toFixed(2)}</Text>
        <Button marginTop={20} onPress={handlePlaceOrder} disabled={items.length === 0}>
          Place Order
        </Button>
      </YStack>
    </View>
  );
};

export default Payment;

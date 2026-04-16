import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Card, Image, ScrollView, Text, XStack, YStack } from 'tamagui';
import { Minus, Plus, X } from '@tamagui/lucide-icons';
import NoData from '../../components/NoData';
import {
  removeFromCart,
  updateQuantity,
  selectCartSubtotal,
} from '../../store/cartSlice';

const SHIPPING = 0;
const TAX_RATE = 0;

const formatSar = (value) => `SAR ${value.toFixed(2)}`;

const CartLine = ({ item, onRemove, onQty }) => (
  <YStack
    gap={10}
    padding={10}
    borderColor="#00000020"
    borderRadius={8}
    borderWidth={1}
  >
    <XStack gap={10} overflow="hidden">
      {item.image ? (
        <Image
          borderRadius={8}
          source={{ uri: item.image }}
          objectFit="cover"
          backgroundColor="#ffffff"
          width={100}
          height={120}
        />
      ) : (
        <View style={{ width: 100, height: 120, backgroundColor: '#eee', borderRadius: 8 }} />
      )}
      <YStack gap={4} flex={1}>
        <Text numberOfLines={2} color="#222">{item.name}</Text>
        {Object.keys(item.selectedOptions || {}).length > 0 ? (
          <Text fontSize={12} color="#666">
            {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(' · ')}
          </Text>
        ) : null}
        <Text fontSize={14} fontWeight="700">{item.price}</Text>
      </YStack>
      <X size={22} color="#666" onPress={() => onRemove(item.key)} />
    </XStack>

    <XStack justifyContent="space-between" alignItems="center">
      <XStack alignItems="center" gap={8}>
        <Button size="$2" icon={Minus} onPress={() => onQty(item.key, item.quantity - 1)} />
        <Text minWidth={24} textAlign="center">{item.quantity}</Text>
        <Button size="$2" icon={Plus} onPress={() => onQty(item.key, item.quantity + 1)} />
      </XStack>
      <Text fontSize={14} fontWeight="600">
        {formatSar(item.priceValue * item.quantity)}
      </Text>
    </XStack>
  </YStack>
);

const SummaryRow = ({ title, value }) => (
  <XStack
    justifyContent="space-between"
    borderBottomWidth={1}
    borderBottomColor="#00000020"
    gap={10}
    paddingVertical={8}
  >
    <Text fontSize={14}>{title}</Text>
    <Text fontSize={14} fontWeight="600">{value}</Text>
  </XStack>
);

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items ?? []);
  const subtotal = useSelector(selectCartSubtotal);
  const tax = subtotal * TAX_RATE;
  const total = subtotal + SHIPPING + tax;

  const onRemove = (key) => dispatch(removeFromCart(key));
  const onQty = (key, quantity) => dispatch(updateQuantity({ key, quantity }));

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <NoData text="Your cart is empty" />
        <Button marginTop={16} onPress={() => navigation.navigate('main')}>
          Continue Shopping
        </Button>
      </View>
    );
  }

  return (
    <>
      <ScrollView>
        <YStack gap={10} padding={10}>
          <Card>
            <YStack gap={10} padding={10}>
              {items.map((item) => (
                <CartLine key={item.key} item={item} onRemove={onRemove} onQty={onQty} />
              ))}
            </YStack>
          </Card>

          <Card>
            <YStack gap={4} padding={10}>
              <Text fontSize={16} marginBottom={6}>Price Summary</Text>
              <SummaryRow title="Subtotal" value={formatSar(subtotal)} />
              <SummaryRow title="Shipping" value={formatSar(SHIPPING)} />
              <SummaryRow title="Tax" value={formatSar(tax)} />
              <XStack justifyContent="space-between" paddingVertical={10}>
                <Text fontSize={16} fontWeight="700">Total</Text>
                <Text fontSize={16} fontWeight="700">{formatSar(total)}</Text>
              </XStack>
            </YStack>
          </Card>
        </YStack>
      </ScrollView>

      <XStack
        gap={10}
        padding={10}
        justifyContent="space-between"
        alignItems="center"
        elevation={4}
      >
        <Text fontSize={18}>Total: {formatSar(total)}</Text>
        <Button
          backgroundColor="#2e7d32"
          color="#ffffff"
          onPress={() => navigation.navigate('checkoutNavigation', { screen: 'address' })}
        >
          Proceed to Checkout
        </Button>
      </XStack>
    </>
  );
};

export default Cart;

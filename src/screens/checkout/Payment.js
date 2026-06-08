import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  Button,
  Image,
  ScrollView,
  Text,
  XStack,
  YStack,
} from 'tamagui';
import {
  BadgeCheck,
  PackageCheck,
  ShieldCheck,
  Zap,
} from '@tamagui/lucide-icons';
import AppHeader from '../../components/AppHeader';
import CollapsibleSection from '../../components/checkout/CollapsibleSection';
import PaymentMethodList from '../../components/checkout/PaymentMethodList';
import { clearCart, selectCartSubtotal, selectCartSavings } from '../../store/cartSlice';
import {
  selectAppliedCoupon,
  selectCouponDiscount,
  removeCoupon,
} from '../../store/couponSlice';
import { placeOrder } from '../../store/authSlice';
import { formatPrice } from '../../utils/formatPrice';
import { colors, radii } from '../../utils/theme';

const COD_SURCHARGE = 35;

const TrustPillar = ({ Icon, label }) => (
  <YStack alignItems="center" flex={1} gap={6}>
    <Icon size={26} color={colors.textMuted} />
    <Text fontSize={11} fontWeight="600" color={colors.textMuted} textAlign="center">
      {label}
    </Text>
  </YStack>
);

const ItemRow = ({ item }) => (
  <XStack
    gap={12}
    paddingVertical={10}
    borderTopWidth={1}
    borderTopColor={colors.borderSoft}
  >
    {item.image ? (
      <Image
        source={{ uri: item.image }}
        width={64}
        height={80}
        borderRadius={radii.sm}
        objectFit="cover"
      />
    ) : (
      <View width={64} height={80} backgroundColor={colors.borderSoft} borderRadius={radii.sm} />
    )}
    <YStack flex={1} gap={4}>
      <Text fontSize={13} fontWeight="700" color={colors.text} numberOfLines={1}>
        {item.subtitle || 'Product'}
      </Text>
      <Text fontSize={12} color={colors.textMuted} numberOfLines={2}>{item.name}</Text>
      <XStack gap={6}>
        {Object.entries(item.selectedOptions || {}).slice(0, 2).map(([k, v]) => (
          <View
            key={k}
            borderWidth={1}
            borderColor={colors.border}
            borderRadius={radii.sm}
            paddingHorizontal={6}
            paddingVertical={2}
            backgroundColor="#eef4ff"
          >
            <Text fontSize={11} color="#1565c0" fontWeight="600">{`${k}: ${v}`}</Text>
          </View>
        ))}
        <View
          borderWidth={1}
          borderColor={colors.border}
          borderRadius={radii.sm}
          paddingHorizontal={6}
          paddingVertical={2}
          backgroundColor="#eef4ff"
        >
          <Text fontSize={11} color="#1565c0" fontWeight="600">{`Qty: ${item.quantity}`}</Text>
        </View>
      </XStack>
    </YStack>
    <YStack alignItems="flex-end">
      <XStack alignItems="baseline" gap={4}>
        <Text fontSize={14} fontWeight="700">{formatPrice(item.priceValue)}</Text>
        {item.listPriceValue ? (
          <Text fontSize={11} color={colors.textSubtle} textDecorationLine="line-through">
            {formatPrice(item.listPriceValue)}
          </Text>
        ) : null}
      </XStack>
      {item.listPriceValue && item.listPriceValue > item.priceValue ? (
        <Text fontSize={11} color={colors.savings}>
          You saved {formatPrice((item.listPriceValue - item.priceValue) * item.quantity)}
        </Text>
      ) : null}
    </YStack>
  </XStack>
);

const Payment = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items ?? []);
  const addresses = useSelector((state) => state.auth?.addresses ?? []);
  const subtotal = useSelector(selectCartSubtotal);
  const itemSavings = useSelector(selectCartSavings);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const couponDiscount = useSelector(selectCouponDiscount);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;
  const [method, setMethod] = useState('upi_gpay');

  const surcharge = method === 'cod' ? COD_SURCHARGE : 0;
  const total = Math.max(0, subtotal - couponDiscount) + surcharge;
  const totalSavings = itemSavings + couponDiscount;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    dispatch(placeOrder({
      items: items.map((i) => ({
        key: i.key,
        productId: i.productId,
        name: i.name,
        subtitle: i.subtitle,
        image: i.image,
        price: i.price,
        priceValue: i.priceValue,
        listPriceValue: i.listPriceValue,
        selectedOptions: i.selectedOptions,
        quantity: i.quantity,
      })),
      address: defaultAddress,
      paymentMethod: method,
      subtotal,
      itemSavings,
      couponDiscount,
      coupon: appliedCoupon ? { code: appliedCoupon.code, discount: couponDiscount } : null,
      savings: totalSavings,
      surcharge,
      total,
    }));
    dispatch(clearCart());
    dispatch(removeCoupon());
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
    <View style={{ flex: 1, backgroundColor: colors.surfaceMuted }}>
      <AppHeader title={`My Payment : ${formatPrice(total)}`} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <YStack padding={12} gap={10}>
          <CollapsibleSection
            title={defaultAddress ? `Delivering order to ${defaultAddress.full_name?.split(' ')[0] || 'You'}` : 'No address selected'}
            titleRight={
              defaultAddress ? (
                <View
                  borderWidth={1}
                  borderColor={colors.accent}
                  borderRadius={radii.sm}
                  paddingHorizontal={6}
                  paddingVertical={1}
                  marginLeft={6}
                >
                  <Text fontSize={11} color={colors.accent} fontWeight="600">
                    {defaultAddress.label || 'home'}
                  </Text>
                </View>
              ) : null
            }
            defaultOpen
          >
            {defaultAddress ? (
              <YStack gap={4}>
                <Text fontSize={14} fontWeight="600" color={colors.text}>
                  {defaultAddress.full_name}
                </Text>
                <Text fontSize={13} color={colors.textMuted}>
                  {[defaultAddress.address_1, defaultAddress.address_2, defaultAddress.city, defaultAddress.post_code]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
                <XStack marginTop={6}>
                  <Text
                    fontSize={13}
                    color="#1565c0"
                    fontWeight="700"
                    onPress={() => navigation.navigate('myaddresses')}
                  >
                    CHANGE
                  </Text>
                </XStack>
              </YStack>
            ) : (
              <Button onPress={() => navigation.navigate('myaddresses')}>
                Add Address
              </Button>
            )}
          </CollapsibleSection>

          <CollapsibleSection title={`Items (${items.length})`}>
            {items.map((item) => (
              <ItemRow key={item.key} item={item} />
            ))}
          </CollapsibleSection>

          <PaymentMethodList selected={method} onSelect={setMethod} />

          <View
            backgroundColor={colors.surface}
            borderRadius={radii.md}
            paddingVertical={16}
            paddingHorizontal={12}
          >
            <XStack>
              <TrustPillar Icon={ShieldCheck} label={`100% SECURE\nPAYMENTS`} />
              <TrustPillar Icon={PackageCheck} label={`EASY RETURNS &\nINSTANT REFUNDS`} />
              <TrustPillar Icon={BadgeCheck} label={`100% GENUINE\nPRODUCT`} />
            </XStack>
          </View>

          {method === 'cod' ? (
            <XStack
              backgroundColor="#fff4e5"
              paddingHorizontal={10}
              paddingVertical={8}
              borderRadius={radii.sm}
              alignItems="center"
              gap={6}
            >
              <Zap size={14} color="#b26a00" />
              <Text fontSize={12} color="#b26a00">
                Cash on Delivery adds {formatPrice(COD_SURCHARGE)} handling charge.
              </Text>
            </XStack>
          ) : null}
        </YStack>
      </ScrollView>

      <XStack
        padding={12}
        gap={10}
        alignItems="center"
        justifyContent="space-between"
        backgroundColor={colors.surface}
        borderTopWidth={1}
        borderTopColor={colors.borderSoft}
        elevation={6}
      >
        <YStack>
          <Text fontSize={16} fontWeight="700" color={colors.text}>{formatPrice(total)}</Text>
          {totalSavings > 0 ? (
            <Text fontSize={12} color={colors.savings} fontWeight="600">
              You save {formatPrice(totalSavings)}
            </Text>
          ) : null}
        </YStack>
        <Button
          backgroundColor={colors.brand}
          color={colors.text}
          fontWeight="800"
          paddingHorizontal={36}
          height={46}
          borderRadius={radii.sm}
          disabled={items.length === 0 || !method}
          opacity={items.length === 0 || !method ? 0.5 : 1}
          onPress={handlePlaceOrder}
        >
          PAY NOW
        </Button>
      </XStack>
    </View>
  );
};

export default Payment;

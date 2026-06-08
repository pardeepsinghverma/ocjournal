import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ScrollView, Text, XStack, YStack } from 'tamagui';
import { ChevronDown, ChevronUp, Heart, PartyPopper, Truck } from '@tamagui/lucide-icons';
import AppHeader from '../../components/AppHeader';
import NoData from '../../components/NoData';
import CartLineCard from '../../components/cart/CartLineCard';
import CouponCard from '../../components/cart/CouponCard';
import PincodeCard from '../../components/cart/PincodeCard';
import TrustRow from '../../components/cart/TrustRow';
import AddressSheet from '../../components/checkout/AddressSheet';
import {
  removeFromCart,
  updateQuantity,
  selectCartSubtotal,
  selectCartCount,
  selectCartListTotal,
  selectCartSavings,
  setPincode,
} from '../../store/cartSlice';
import { selectAppliedCoupon, selectCouponDiscount, removeCoupon } from '../../store/couponSlice';
import { formatPrice } from '../../utils/formatPrice';
import { colors, radii } from '../../utils/theme';

const SummaryRow = ({ title, value, bold }) => (
  <XStack justifyContent="space-between" paddingVertical={6}>
    <Text fontSize={14} color={colors.text} fontWeight={bold ? '700' : '500'}>{title}</Text>
    <Text fontSize={14} color={colors.text} fontWeight={bold ? '700' : '600'}>{value}</Text>
  </XStack>
);

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart?.items ?? []);
  const pincode = useSelector((state) => state.cart?.pincode);
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartSubtotal);
  const listTotal = useSelector(selectCartListTotal);
  const itemSavings = useSelector(selectCartSavings);
  const appliedCoupon = useSelector(selectAppliedCoupon);
  const couponDiscount = useSelector(selectCouponDiscount);
  const totalSavings = itemSavings + couponDiscount;
  const addresses = useSelector((state) => state.auth?.addresses ?? []);
  const defaultAddress = addresses.find((a) => a.isDefault);
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [addressSheetOpen, setAddressSheetOpen] = useState(false);

  useEffect(() => {
    if (appliedCoupon && subtotal < (appliedCoupon.minOrder || 0)) {
      dispatch(removeCoupon());
    }
  }, [appliedCoupon, subtotal, dispatch]);

  const handleProceed = () => {
    if (addresses.length === 0) {
      navigation.navigate('myaddresses');
      return;
    }
    setAddressSheetOpen(true);
  };

  const handleAddressConfirm = () => {
    navigation.navigate('checkoutNavigation', { screen: 'payment' });
  };

  useEffect(() => {
    if (!pincode && defaultAddress?.post_code) {
      dispatch(setPincode(defaultAddress.post_code));
    }
  }, [pincode, defaultAddress, dispatch]);

  const shipping = 0;
  const total = Math.max(0, subtotal - couponDiscount) + shipping;

  const onRemove = (key) => dispatch(removeFromCart(key));
  const onQty = (key, quantity) => dispatch(updateQuantity({ key, quantity }));

  const headerTitle = items.length === 0
    ? 'My Bag'
    : `My Bag (${count} Item${count === 1 ? '' : 's'})`;

  const headerRight = (
    <Heart
      size={22}
      color={colors.text}
      onPress={() => navigation.navigate('wishlist')}
    />
  );

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.surfaceMuted }}>
        <AppHeader title={headerTitle} rightSlot={headerRight} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <NoData text="Your cart is empty" />
          <Button marginTop={16} onPress={() => navigation.navigate('main')}>
            Continue Shopping
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.surfaceMuted }}>
      <AppHeader title={headerTitle} rightSlot={headerRight} />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <YStack gap={10} padding={10}>
          <PincodeCard />

          <CouponCard
            onApply={() => console.log('Apply coupon tapped')}
            onMore={() => console.log('More coupons tapped')}
          />

          <YStack gap={12}>
            {items.map((item) => (
              <CartLineCard
                key={item.key}
                item={item}
                pincode={pincode}
                onRemove={onRemove}
                onQty={onQty}
              />
            ))}
          </YStack>

          <View backgroundColor={colors.surface} borderRadius={radii.md} padding={12}>
            <XStack
              justifyContent="space-between"
              alignItems="center"
              onPress={() => setSummaryOpen((v) => !v)}
            >
              <Text fontSize={16} fontWeight="700" color={colors.text}>Price Summary</Text>
              {summaryOpen ? (
                <ChevronUp size={18} color={colors.text} />
              ) : (
                <ChevronDown size={18} color={colors.text} />
              )}
            </XStack>

            {summaryOpen ? (
              <YStack marginTop={6}>
                <SummaryRow title={`Bag total (${count} item${count === 1 ? '' : 's'})`} value={formatPrice(listTotal || subtotal)} />
                {itemSavings > 0 ? (
                  <SummaryRow title="Item discount" value={`- ${formatPrice(itemSavings)}`} />
                ) : null}
                {couponDiscount > 0 ? (
                  <SummaryRow title={`Coupon (${appliedCoupon?.code})`} value={`- ${formatPrice(couponDiscount)}`} />
                ) : null}
                <SummaryRow title="Shipping" value={shipping > 0 ? formatPrice(shipping) : 'FREE'} />
                <View height={1} backgroundColor={colors.borderSoft} marginVertical={4} />
                <SummaryRow title="Total" value={formatPrice(total)} bold />
              </YStack>
            ) : (
              <XStack justifyContent="space-between" marginTop={4}>
                <Text fontSize={14} color={colors.text}>Total</Text>
                <Text fontSize={14} fontWeight="700" color={colors.text}>{formatPrice(total)}</Text>
              </XStack>
            )}
          </View>

          <View
            backgroundColor={colors.successSoft}
            borderRadius={radii.md}
            paddingVertical={10}
            paddingHorizontal={12}
          >
            <XStack alignItems="center" gap={8} justifyContent="center">
              <Truck size={16} color={colors.success} />
              <Text color={colors.text} fontSize={13}>
                Yayy! You get <Text fontWeight="700" color={colors.success}>FREE delivery</Text> on this order
              </Text>
            </XStack>
          </View>

          <TrustRow />
        </YStack>
      </ScrollView>

      {totalSavings > 0 ? (
        <XStack
          backgroundColor={colors.success}
          paddingVertical={8}
          paddingHorizontal={12}
          alignItems="center"
          justifyContent="center"
          gap={8}
        >
          <PartyPopper size={16} color="#ffffff" />
          <Text color="#ffffff" fontSize={13} fontWeight="600">
            You are saving {formatPrice(totalSavings)} on this order
          </Text>
        </XStack>
      ) : null}

      <XStack
        gap={10}
        padding={12}
        justifyContent="space-between"
        alignItems="center"
        backgroundColor={colors.surface}
        borderTopWidth={1}
        borderTopColor={colors.borderSoft}
        elevation={6}
      >
        <YStack>
          <Text fontSize={16} fontWeight="700" color={colors.text}>{formatPrice(total)}</Text>
          <Text fontSize={12} color="#1565c0" fontWeight="600">VIEW DETAILS</Text>
        </YStack>
        <Button
          backgroundColor={colors.brand}
          color={colors.text}
          fontWeight="800"
          paddingHorizontal={36}
          height={46}
          borderRadius={6}
          onPress={handleProceed}
        >
          PROCEED
        </Button>
      </XStack>

      <AddressSheet
        open={addressSheetOpen}
        onOpenChange={setAddressSheetOpen}
        onConfirm={handleAddressConfirm}
      />
    </View>
  );
};

export default Cart;

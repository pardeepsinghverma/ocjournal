import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, XStack } from 'tamagui';
import { BadgePercent, ChevronRight, X } from '@tamagui/lucide-icons';
import CouponSheet from './CouponSheet';
import {
  FEATURED_COUPON,
  applyCoupon,
  removeCoupon,
  selectAppliedCoupon,
  selectCouponDiscount,
} from '../../store/couponSlice';
import { selectCartSubtotal } from '../../store/cartSlice';
import { colors, radii } from '../../utils/theme';
import { formatPrice } from '../../utils/formatPrice';

const CouponCard = () => {
  const dispatch = useDispatch();
  const applied = useSelector(selectAppliedCoupon);
  const subtotal = useSelector(selectCartSubtotal);
  const discount = useSelector(selectCouponDiscount);
  const [sheetOpen, setSheetOpen] = useState(false);

  const featured = FEATURED_COUPON;
  const featuredEligible = subtotal >= (featured?.minOrder || 0);

  if (applied) {
    return (
      <View
        backgroundColor={colors.couponSoft}
        borderRadius={radii.md}
        padding={12}
        gap={10}
      >
        <XStack justifyContent="space-between" alignItems="center" gap={10}>
          <XStack alignItems="center" gap={8} flex={1}>
            <BadgePercent size={18} color={colors.coupon} />
            <View flex={1}>
              <Text fontSize={13} fontWeight="700" color={colors.coupon}>
                {applied.code} applied
              </Text>
              <Text fontSize={12} color={colors.text}>
                You saved {formatPrice(discount)} with this coupon
              </Text>
            </View>
          </XStack>
          <TouchableOpacity onPress={() => dispatch(removeCoupon())}>
            <XStack alignItems="center" gap={4}>
              <X size={14} color={colors.coupon} />
              <Text color={colors.coupon} fontWeight="700" fontSize={13}>REMOVE</Text>
            </XStack>
          </TouchableOpacity>
        </XStack>

        <TouchableOpacity onPress={() => setSheetOpen(true)}>
          <XStack
            alignItems="center"
            justifyContent="center"
            paddingTop={6}
            borderTopWidth={1}
            borderTopColor="#d9c9f5"
          >
            <Text fontSize={13} color={colors.coupon} fontWeight="600">
              View more coupons
            </Text>
            <ChevronRight size={16} color={colors.coupon} />
          </XStack>
        </TouchableOpacity>

        <CouponSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      </View>
    );
  }

  const handleApplyFeatured = () => {
    if (featuredEligible && featured) {
      dispatch(applyCoupon(featured));
    }
  };

  return (
    <View
      backgroundColor={colors.couponSoft}
      borderRadius={radii.md}
      padding={12}
      gap={10}
    >
      <XStack alignItems="flex-start" justifyContent="space-between" gap={10}>
        <View flex={1}>
          <Text fontSize={12} fontWeight="700" color={colors.coupon} marginBottom={4}>
            Best offer unlocked! 🎉
          </Text>
          <Text fontSize={13} color={colors.text}>
            <Text fontWeight="700" color={colors.coupon}>{featured.code}</Text>
            <Text> · {featured.description}</Text>
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleApplyFeatured}
          disabled={!featuredEligible}
          activeOpacity={featuredEligible ? 0.7 : 1}
        >
          <View
            borderWidth={1}
            borderColor={colors.coupon}
            borderRadius={radii.sm}
            paddingHorizontal={14}
            paddingVertical={8}
            opacity={featuredEligible ? 1 : 0.5}
          >
            <Text color={colors.coupon} fontWeight="700">Apply</Text>
          </View>
        </TouchableOpacity>
      </XStack>

      <TouchableOpacity onPress={() => setSheetOpen(true)}>
        <XStack
          alignItems="center"
          justifyContent="center"
          paddingTop={6}
          borderTopWidth={1}
          borderTopColor="#d9c9f5"
        >
          <Text fontSize={13} color={colors.coupon} fontWeight="600">
            Apply More Coupons/Gift Cards
          </Text>
          <ChevronRight size={16} color={colors.coupon} />
        </XStack>
      </TouchableOpacity>

      <CouponSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </View>
  );
};

export default CouponCard;

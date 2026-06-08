import React from 'react';
import { TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView, Sheet, Text, View, XStack, YStack } from 'tamagui';
import { BadgePercent, Check, X } from '@tamagui/lucide-icons';
import {
  AVAILABLE_COUPONS,
  applyCoupon,
  removeCoupon,
  selectAppliedCoupon,
} from '../../store/couponSlice';
import { selectCartSubtotal } from '../../store/cartSlice';
import { colors, radii } from '../../utils/theme';
import { formatPrice } from '../../utils/formatPrice';

const CouponRow = ({ coupon, applied, eligible, onApply, onRemove }) => (
  <View
    borderWidth={1}
    borderColor={applied ? colors.coupon : colors.border}
    borderRadius={radii.md}
    padding={12}
    marginBottom={10}
    backgroundColor={applied ? colors.couponSoft : colors.surface}
  >
    <XStack justifyContent="space-between" alignItems="flex-start" gap={10}>
      <YStack flex={1} gap={4}>
        <XStack alignItems="center" gap={6}>
          <BadgePercent size={16} color={colors.coupon} />
          <Text fontSize={14} fontWeight="700" color={colors.coupon}>{coupon.code}</Text>
        </XStack>
        <Text fontSize={13} fontWeight="600" color={colors.text}>{coupon.title}</Text>
        <Text fontSize={12} color={colors.textMuted}>{coupon.description}</Text>
        {!eligible ? (
          <Text fontSize={12} color={colors.danger}>
            Add {formatPrice(coupon.minOrder)}+ to unlock
          </Text>
        ) : null}
      </YStack>
      {applied ? (
        <TouchableOpacity onPress={onRemove}>
          <XStack alignItems="center" gap={4}>
            <Check size={16} color={colors.coupon} />
            <Text fontSize={13} color={colors.coupon} fontWeight="700">REMOVE</Text>
          </XStack>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={eligible ? onApply : undefined}
          disabled={!eligible}
          activeOpacity={eligible ? 0.7 : 1}
        >
          <View
            borderWidth={1}
            borderColor={eligible ? colors.coupon : colors.border}
            borderRadius={radii.sm}
            paddingHorizontal={14}
            paddingVertical={6}
            opacity={eligible ? 1 : 0.5}
          >
            <Text color={colors.coupon} fontWeight="700">APPLY</Text>
          </View>
        </TouchableOpacity>
      )}
    </XStack>
  </View>
);

const CouponSheet = ({ open, onOpenChange }) => {
  const dispatch = useDispatch();
  const applied = useSelector(selectAppliedCoupon);
  const subtotal = useSelector(selectCartSubtotal);

  const handleApply = (coupon) => {
    dispatch(applyCoupon(coupon));
    onOpenChange(false);
  };

  const handleRemove = () => {
    dispatch(removeCoupon());
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPointsMode="fit"
      dismissOnSnapToBottom
    >
      <Sheet.Overlay />
      <Sheet.Handle />
      <Sheet.Frame padding={0} backgroundColor={colors.surface}>
        <XStack
          justifyContent="space-between"
          alignItems="center"
          paddingHorizontal={16}
          paddingVertical={14}
          borderBottomWidth={1}
          borderBottomColor={colors.borderSoft}
        >
          <Text fontSize={16} fontWeight="700" color={colors.text}>Apply Coupon</Text>
          <TouchableOpacity onPress={() => onOpenChange(false)}>
            <X size={22} color={colors.text} />
          </TouchableOpacity>
        </XStack>

        <ScrollView style={{ maxHeight: 420 }} contentContainerStyle={{ padding: 16 }}>
          {AVAILABLE_COUPONS.map((coupon) => (
            <CouponRow
              key={coupon.code}
              coupon={coupon}
              applied={applied?.code === coupon.code}
              eligible={subtotal >= (coupon.minOrder || 0)}
              onApply={() => handleApply(coupon)}
              onRemove={handleRemove}
            />
          ))}
        </ScrollView>
      </Sheet.Frame>
    </Sheet>
  );
};

export default CouponSheet;

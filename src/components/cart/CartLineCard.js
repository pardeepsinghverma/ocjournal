import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, Image, Sheet, Text, View, XStack, YStack } from 'tamagui';
import { CheckCircle2, ChevronDown, Truck, X } from '@tamagui/lucide-icons';
import { colors, radii } from '../../utils/theme';
import { formatPrice } from '../../utils/formatPrice';

const etaString = (pincode) => {
  const d = new Date();
  d.setDate(d.getDate() + (pincode ? 5 : 7));
  return d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
};

const Pill = ({ label, onPress, disabled }) => (
  <TouchableOpacity onPress={disabled ? undefined : onPress} activeOpacity={0.8}>
    <XStack
      alignItems="center"
      gap={6}
      paddingHorizontal={10}
      paddingVertical={6}
      borderWidth={1}
      borderColor={colors.border}
      borderRadius={radii.sm}
      backgroundColor="#eef4ff"
    >
      <Text fontSize={13} color="#1565c0" fontWeight="600">{label}</Text>
      {!disabled ? <ChevronDown size={14} color="#1565c0" /> : null}
    </XStack>
  </TouchableOpacity>
);

const QuantitySheet = ({ open, onOpenChange, current, onSelect }) => (
  <Sheet
    modal
    open={open}
    onOpenChange={onOpenChange}
    snapPointsMode="fit"
    dismissOnSnapToBottom
  >
    <Sheet.Overlay />
    <Sheet.Handle />
    <Sheet.Frame padding="$4" backgroundColor={colors.surface}>
      <XStack justifyContent="space-between" alignItems="center" marginBottom={12}>
        <Text fontSize={16} fontWeight="700" color={colors.text}>Select Quantity</Text>
        <View onPress={() => onOpenChange(false)}>
          <X size={22} color={colors.text} />
        </View>
      </XStack>

      <XStack gap={8} flexWrap="wrap">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
          const selected = n === current;
          return (
            <TouchableOpacity key={n} onPress={() => onSelect(n)} activeOpacity={0.85}>
              <View
                minWidth={52}
                paddingVertical={10}
                paddingHorizontal={14}
                borderRadius={radii.sm}
                borderWidth={1}
                borderColor={selected ? colors.text : colors.border}
                backgroundColor={selected ? colors.text : colors.surface}
              >
                <Text
                  textAlign="center"
                  fontWeight="600"
                  color={selected ? colors.surface : colors.text}
                >
                  {n}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </XStack>
    </Sheet.Frame>
  </Sheet>
);

const CartLineCard = ({ item, pincode, onRemove, onQty }) => {
  const [qtyOpen, setQtyOpen] = useState(false);
  const hasList = (item.listPriceValue || 0) > item.priceValue;
  const savedPerUnit = hasList ? item.listPriceValue - item.priceValue : 0;

  const sizeValue =
    item.selectedOptions?.Size ||
    item.selectedOptions?.size ||
    Object.values(item.selectedOptions || {})[0];

  return (
    <View
      backgroundColor={colors.surface}
      borderRadius={radii.md}
      borderWidth={1}
      borderColor={colors.border}
      overflow="hidden"
    >
      <XStack gap={12} padding={12}>
        {item.image ? (
          <Image
            source={{ uri: item.image }}
            width={100}
            height={120}
            borderRadius={radii.sm}
            objectFit="cover"
            backgroundColor={colors.borderSoft}
          />
        ) : (
          <View width={100} height={120} backgroundColor={colors.borderSoft} borderRadius={radii.sm} />
        )}

        <YStack flex={1} gap={6}>
          <XStack justifyContent="space-between" alignItems="flex-start" gap={6}>
            <YStack flex={1}>
              <Text fontSize={14} fontWeight="700" color={colors.text} numberOfLines={1}>
                {item.subtitle || 'Product'}
              </Text>
              <Text fontSize={12} color={colors.textMuted} numberOfLines={2}>
                {item.name}
              </Text>
            </YStack>
            <TouchableOpacity onPress={() => onRemove(item.key)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <X size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </XStack>

          <XStack alignItems="center" gap={6} marginTop={4}>
            <View
              width={18}
              height={18}
              borderRadius={9}
              backgroundColor={colors.successSoft}
              alignItems="center"
              justifyContent="center"
            >
              <CheckCircle2 size={14} color={colors.success} />
            </View>
            <Text fontSize={12} color={colors.textMuted}>
              Get it by <Text fontWeight="700" color={colors.success}>{etaString(pincode)}</Text>
            </Text>
          </XStack>
        </YStack>
      </XStack>

      <XStack
        paddingHorizontal={12}
        paddingVertical={10}
        justifyContent="space-between"
        alignItems="center"
        borderTopWidth={1}
        borderTopColor={colors.borderSoft}
      >
        <XStack gap={8}>
          {sizeValue ? <Pill label={`Size : ${sizeValue}`} disabled /> : null}
          <Pill label={`Qty : ${item.quantity}`} onPress={() => setQtyOpen(true)} />
        </XStack>

        <YStack alignItems="flex-end">
          <XStack alignItems="baseline" gap={6}>
            <Text fontSize={15} fontWeight="700" color={colors.text}>
              {formatPrice(item.priceValue)}
            </Text>
            {hasList ? (
              <Text fontSize={12} color={colors.textSubtle} textDecorationLine="line-through">
                {formatPrice(item.listPriceValue)}
              </Text>
            ) : null}
          </XStack>
          {savedPerUnit > 0 ? (
            <Text fontSize={12} color={colors.savings} fontWeight="600">
              You saved {formatPrice(savedPerUnit * item.quantity)}
            </Text>
          ) : null}
        </YStack>
      </XStack>

      <QuantitySheet
        open={qtyOpen}
        onOpenChange={setQtyOpen}
        current={item.quantity}
        onSelect={(n) => {
          onQty(item.key, n);
          setQtyOpen(false);
        }}
      />
    </View>
  );
};

export default CartLineCard;

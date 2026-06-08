import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Button, Input, Sheet, Text, View, XStack, YStack } from 'tamagui';
import { MapPin, X } from '@tamagui/lucide-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setPincode } from '../../store/cartSlice';
import { colors, radii } from '../../utils/theme';

const PincodeCard = () => {
  const dispatch = useDispatch();
  const pincode = useSelector((s) => s.cart?.pincode);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(pincode || '');

  const handleApply = () => {
    const trimmed = (value || '').trim();
    if (trimmed.length < 4) return;
    dispatch(setPincode(trimmed));
    setOpen(false);
  };

  return (
    <View
      backgroundColor={colors.surface}
      borderRadius={radii.md}
      paddingHorizontal={14}
      paddingVertical={12}
      borderWidth={1}
      borderColor={colors.border}
    >
      <XStack alignItems="center" justifyContent="space-between">
        <XStack alignItems="center" gap={10} flex={1}>
          <MapPin size={18} color={colors.text} />
          <Text fontSize={14} fontWeight="600" color={colors.text}>
            {pincode ? `Deliver to: ${pincode}` : 'Add delivery pincode'}
          </Text>
        </XStack>
        <TouchableOpacity onPress={() => setOpen(true)}>
          <Text fontSize={14} color="#1565c0" fontWeight="700">
            {pincode ? 'Change' : 'Add'}
          </Text>
        </TouchableOpacity>
      </XStack>

      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPointsMode="fit"
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding="$4" backgroundColor={colors.surface}>
          <XStack justifyContent="space-between" alignItems="center" marginBottom={12}>
            <Text fontSize={16} fontWeight="700" color={colors.text}>
              Enter Pincode
            </Text>
            <View onPress={() => setOpen(false)}>
              <X size={22} color={colors.text} />
            </View>
          </XStack>

          <YStack gap={10}>
            <Input
              placeholder="e.g. 141011"
              keyboardType="number-pad"
              value={value}
              onChangeText={setValue}
              maxLength={6}
            />
            <Button
              backgroundColor={colors.brand}
              color={colors.text}
              fontWeight="700"
              onPress={handleApply}
            >
              APPLY
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
};

export default PincodeCard;

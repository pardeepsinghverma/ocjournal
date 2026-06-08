import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Button, ScrollView, Sheet, Text, View, XStack, YStack } from 'tamagui';
import { Circle, CircleDot, Plus, X } from '@tamagui/lucide-icons';
import { setDefaultAddress } from '../../store/authSlice';
import { colors, radii } from '../../utils/theme';

const AddressRow = ({ address, selected, onSelect, onEdit }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={() => onSelect(address.id)}>
    <XStack
      paddingVertical={14}
      gap={12}
      alignItems="flex-start"
      borderBottomWidth={1}
      borderBottomColor={colors.borderSoft}
    >
      <View marginTop={2}>
        {selected ? (
          <CircleDot size={20} color={colors.brand} />
        ) : (
          <Circle size={20} color={colors.textSubtle} />
        )}
      </View>

      <YStack flex={1} gap={4}>
        <XStack alignItems="center" gap={6}>
          <Text fontSize={15} fontWeight="700" color={colors.text}>{address.full_name}</Text>
          <View
            borderWidth={1}
            borderColor={colors.accent}
            borderRadius={radii.sm}
            paddingHorizontal={6}
            paddingVertical={1}
          >
            <Text fontSize={11} color={colors.accent} fontWeight="600">
              {address.label || 'home'}
            </Text>
          </View>
        </XStack>
        <Text fontSize={13} color={colors.textMuted} numberOfLines={2}>
          {[address.address_1, address.address_2, address.city, address.post_code].filter(Boolean).join(', ')}
        </Text>
        {address.phone ? (
          <Text fontSize={12} color={colors.textMuted}>Contact number: {address.phone}</Text>
        ) : null}
      </YStack>

      <TouchableOpacity onPress={() => onEdit(address)}>
        <Text fontSize={13} color="#1565c0" fontWeight="700">EDIT</Text>
      </TouchableOpacity>
    </XStack>
  </TouchableOpacity>
);

const AddressSheet = ({ open, onOpenChange, onConfirm }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.auth?.addresses ?? []);
  const defaultAddress = addresses.find((a) => a.isDefault);
  const [selectedId, setSelectedId] = useState(defaultAddress?.id ?? addresses[0]?.id ?? null);

  useEffect(() => {
    if (open) {
      setSelectedId(defaultAddress?.id ?? addresses[0]?.id ?? null);
    }
  }, [open, defaultAddress, addresses]);

  const handleConfirm = () => {
    if (!selectedId) return;
    dispatch(setDefaultAddress(selectedId));
    const address = addresses.find((a) => a.id === selectedId) || null;
    onOpenChange(false);
    if (onConfirm) onConfirm(address);
  };

  const handleAdd = () => {
    onOpenChange(false);
    navigation.navigate('myaddresses');
  };

  const handleEdit = () => {
    onOpenChange(false);
    navigation.navigate('myaddresses');
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
          <Text fontSize={16} fontWeight="700" color={colors.text}>
            Select Delivery Address
          </Text>
          <TouchableOpacity onPress={() => onOpenChange(false)}>
            <X size={22} color={colors.text} />
          </TouchableOpacity>
        </XStack>

        {addresses.length === 0 ? (
          <YStack padding={24} gap={12} alignItems="center">
            <Text fontSize={14} color={colors.textMuted}>No saved addresses yet.</Text>
            <Button onPress={handleAdd}>Add Address</Button>
          </YStack>
        ) : (
          <ScrollView style={{ maxHeight: 340 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
            {addresses.map((address) => (
              <AddressRow
                key={address.id}
                address={address}
                selected={address.id === selectedId}
                onSelect={setSelectedId}
                onEdit={handleEdit}
              />
            ))}
          </ScrollView>
        )}

        <XStack
          paddingHorizontal={16}
          paddingVertical={12}
          justifyContent="flex-end"
        >
          <TouchableOpacity onPress={handleAdd}>
            <XStack alignItems="center" gap={4}>
              <Plus size={14} color="#1565c0" />
              <Text fontSize={13} color="#1565c0" fontWeight="700">ADD NEW ADDRESS</Text>
            </XStack>
          </TouchableOpacity>
        </XStack>

        <YStack paddingHorizontal={16} paddingBottom={16}>
          <Button
            backgroundColor={colors.brand}
            color={colors.text}
            fontWeight="800"
            height={48}
            borderRadius={radii.sm}
            disabled={!selectedId}
            opacity={selectedId ? 1 : 0.5}
            onPress={handleConfirm}
          >
            SELECT ADDRESS
          </Button>
        </YStack>
      </Sheet.Frame>
    </Sheet>
  );
};

export default AddressSheet;

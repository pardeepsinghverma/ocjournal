import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Text, View, XStack, YStack } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setDefaultAddress } from '../../store/authSlice';

const Address = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.auth?.addresses ?? []);
  const defaultAddress = addresses.find((a) => a.isDefault);
  const [selectedId, setSelectedId] = useState(defaultAddress?.id ?? addresses[0]?.id ?? null);

  useEffect(() => {
    if (!selectedId && addresses.length) {
      setSelectedId(defaultAddress?.id ?? addresses[0].id);
    }
  }, [addresses, selectedId, defaultAddress]);

  if (addresses.length === 0) {
    return (
      <View flex={1} padding={20} backgroundColor="#ffffff">
        <YStack gap={12}>
          <Text fontSize={18} fontWeight="600">No saved addresses</Text>
          <Text color="#555">Add an address to continue checkout.</Text>
          <Button onPress={() => navigation.navigate('myaddresses')}>Add Address</Button>
        </YStack>
      </View>
    );
  }

  const handleContinue = () => {
    if (selectedId) {
      dispatch(setDefaultAddress(selectedId));
    }
    navigation.navigate('payment');
  };

  return (
    <View flex={1} backgroundColor="#f7f7f7">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text fontSize={18} fontWeight="700" marginBottom={12}>Select delivery address</Text>
        {addresses.map((address) => {
          const isSelected = address.id === selectedId;
          return (
            <View
              key={address.id}
              onPress={() => setSelectedId(address.id)}
              borderWidth={1}
              borderColor={isSelected ? '#000' : '#ddd'}
              backgroundColor="#ffffff"
              borderRadius={8}
              padding={12}
              marginBottom={10}
            >
              <XStack justifyContent="space-between" alignItems="center" marginBottom={6}>
                <Text fontWeight="700">{address.full_name}</Text>
                {isSelected ? <Check size={18} /> : null}
              </XStack>
              <Text color="#555" fontSize={13}>
                {[address.address_1, address.city, address.region, address.post_code]
                  .filter(Boolean)
                  .join(', ')}
              </Text>
              <Text color="#555" fontSize={13}>{address.country}</Text>
            </View>
          );
        })}

        <Button marginTop={10} onPress={() => navigation.navigate('myaddresses')}>
          Manage Addresses
        </Button>
      </ScrollView>

      <YStack padding={16}>
        <Button onPress={handleContinue} disabled={!selectedId}>Continue to Payment</Button>
      </YStack>
    </View>
  );
};

export default Address;

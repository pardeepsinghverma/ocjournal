import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { Button, Sheet, Text, View, XStack, YStack } from 'tamagui';
import { Check, Plus, Trash2 } from '@tamagui/lucide-icons';
import { useDispatch, useSelector } from 'react-redux';
import RegisterForm from '../../components/Registerform';
import {
  addAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
} from '../../store/authSlice';

const addressFormFields = [
  { label: 'Full Name', type: 'text', validation: 'required' },
  { label: 'Phone', type: 'text', validation: 'required' },
  { label: 'Address 1', type: 'text', validation: 'required' },
  { label: 'Address 2', type: 'text' },
  { label: 'City', type: 'text', validation: 'required' },
  { label: 'Post Code', type: 'text', validation: 'required' },
  {
    label: 'Country',
    type: 'selectbox',
    options: [
      { label: 'Saudi Arabia', value: 'saudi_arabia' },
      { label: 'United States', value: 'united_states' },
      { label: 'United Kingdom', value: 'united_kingdom' },
      { label: 'India', value: 'india' },
    ],
    validation: 'required',
  },
  {
    label: 'Region',
    type: 'selectbox',
    options: [
      { label: 'Riyadh', value: 'riyadh' },
      { label: 'Mecca', value: 'mecca' },
      { label: 'Medina', value: 'medina' },
      { label: 'Jeddah', value: 'jeddah' },
    ],
    validation: 'required',
  },
];

const addressToValues = (address) => ({
  full_name: address?.full_name ?? '',
  phone: address?.phone ?? '',
  address_1: address?.address_1 ?? '',
  address_2: address?.address_2 ?? '',
  city: address?.city ?? '',
  post_code: address?.post_code ?? '',
  country: address?.country ?? '',
  region: address?.region ?? '',
});

const AddressCard = ({ address, onDelete, onMakeDefault, onEdit }) => (
  <View
    borderWidth={1}
    borderColor={address.isDefault ? '#2e7d32' : '#e0e0e0'}
    backgroundColor="#ffffff"
    borderRadius={8}
    padding={12}
    marginBottom={10}
  >
    <XStack justifyContent="space-between" alignItems="center" marginBottom={6}>
      <Text fontWeight="700">{address.full_name}</Text>
      {address.isDefault ? (
        <Text color="#2e7d32" fontSize={12} fontWeight="600">DEFAULT</Text>
      ) : null}
    </XStack>
    <Text color="#555" fontSize={13}>{address.phone}</Text>
    <Text color="#555" fontSize={13}>
      {[address.address_1, address.address_2].filter(Boolean).join(', ')}
    </Text>
    <Text color="#555" fontSize={13}>
      {[address.city, address.region, address.post_code].filter(Boolean).join(', ')}
    </Text>
    <Text color="#555" fontSize={13}>{address.country}</Text>

    <XStack gap={8} marginTop={10} flexWrap="wrap">
      <Button size="$2" onPress={() => onEdit(address)}>Edit</Button>
      {!address.isDefault ? (
        <Button size="$2" icon={Check} onPress={() => onMakeDefault(address.id)}>
          Make Default
        </Button>
      ) : null}
      <Button size="$2" backgroundColor="#d32f2f" color="#ffffff" icon={Trash2} onPress={() => onDelete(address.id)}>
        Delete
      </Button>
    </XStack>
  </View>
);

const MyAddresses = () => {
  const dispatch = useDispatch();
  const addresses = useSelector((state) => state.auth?.addresses ?? []);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setSheetOpen(true);
  };

  const openEdit = (address) => {
    setEditing(address);
    setSheetOpen(true);
  };

  const handleSubmit = (values) => {
    if (editing) {
      dispatch(updateAddress({ id: editing.id, ...values }));
    } else {
      dispatch(addAddress(values));
    }
    setSheetOpen(false);
    setEditing(null);
  };

  return (
    <View flex={1} backgroundColor="#f7f7f7">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {addresses.length === 0 ? (
          <Text color="#666" textAlign="center" marginTop={40}>
            No addresses saved yet.
          </Text>
        ) : (
          addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onDelete={(id) => dispatch(deleteAddress(id))}
              onMakeDefault={(id) => dispatch(setDefaultAddress(id))}
              onEdit={openEdit}
            />
          ))
        )}
      </ScrollView>

      <YStack padding={16}>
        <Button icon={Plus} onPress={openAdd}>Add New Address</Button>
      </YStack>

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        snapPoints={[90]}
        modal
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Handle />
        <Sheet.Frame padding="$2" backgroundColor="#ffffff">
          <ScrollView>
            <Text fontSize={18} fontWeight="700" paddingHorizontal="$4" paddingTop="$2">
              {editing ? 'Edit Address' : 'Add Address'}
            </Text>
            {sheetOpen ? (
              <RegisterForm
                formFields={addressFormFields}
                initialValues={editing ? addressToValues(editing) : addressToValues(null)}
                onSuccess={handleSubmit}
                submitLabel={editing ? 'Save Changes' : 'Save Address'}
              />
            ) : null}
          </ScrollView>
        </Sheet.Frame>
      </Sheet>
    </View>
  );
};

export default MyAddresses;

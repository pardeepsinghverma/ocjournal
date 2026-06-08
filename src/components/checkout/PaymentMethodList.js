import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Text, View, XStack, YStack } from 'tamagui';
import {
  Banknote,
  Building2,
  ChevronDown,
  ChevronUp,
  Circle,
  CircleDot,
  CreditCard,
  Plus,
  Wallet,
  Zap,
} from '@tamagui/lucide-icons';
import { colors, radii } from '../../utils/theme';

const Group = ({ title, children, defaultOpen = false, noCollapse = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => !noCollapse && setOpen((v) => !v);

  return (
    <YStack>
      <TouchableOpacity activeOpacity={noCollapse ? 1 : 0.75} onPress={toggle}>
        <XStack
          paddingHorizontal={14}
          paddingVertical={14}
          alignItems="center"
          justifyContent="space-between"
          borderTopWidth={1}
          borderTopColor={colors.borderSoft}
        >
          <Text fontSize={15} fontWeight="700" color={colors.text}>{title}</Text>
          {!noCollapse ? (
            open ? <ChevronUp size={18} color={colors.text} /> : <ChevronDown size={18} color={colors.text} />
          ) : null}
        </XStack>
      </TouchableOpacity>

      {(noCollapse || open) ? (
        <YStack paddingHorizontal={14} paddingBottom={14}>
          {children}
        </YStack>
      ) : null}
    </YStack>
  );
};

const MethodRow = ({ id, Icon, label, sublabel, selected, onSelect }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={() => onSelect(id)}>
    <XStack paddingVertical={12} gap={12} alignItems="center">
      {Icon ? (
        <View width={28} alignItems="center">
          <Icon size={22} color={colors.text} />
        </View>
      ) : null}
      <YStack flex={1}>
        <Text fontSize={14} fontWeight="600" color={colors.text}>{label}</Text>
        {sublabel ? <Text fontSize={12} color={colors.textMuted}>{sublabel}</Text> : null}
      </YStack>
      {selected ? <CircleDot size={20} color={colors.brand} /> : <Circle size={20} color={colors.textSubtle} />}
    </XStack>
  </TouchableOpacity>
);

const Divider = () => (
  <View height={1} backgroundColor={colors.borderSoft} />
);

const Banner = ({ Icon, text }) => (
  <XStack
    gap={6}
    alignItems="center"
    justifyContent="center"
    paddingVertical={8}
    backgroundColor="#e8eefc"
    borderRadius={radii.sm}
    marginBottom={10}
  >
    {Icon ? <Icon size={14} color="#1565c0" /> : null}
    <Text fontSize={12} color="#1565c0" fontWeight="600">{text}</Text>
  </XStack>
);

const PaymentMethodList = ({ selected, onSelect }) => (
  <View
    backgroundColor={colors.surface}
    borderRadius={radii.md}
    borderWidth={1}
    borderColor={colors.border}
    overflow="hidden"
  >
    <Group title="Debit & Credit Card" noCollapse>
      <TouchableOpacity onPress={() => {}}>
        <XStack
          paddingHorizontal={12}
          paddingVertical={14}
          alignItems="center"
          justifyContent="space-between"
          borderWidth={1}
          borderColor={colors.border}
          borderRadius={radii.sm}
        >
          <XStack alignItems="center" gap={10}>
            <Plus size={18} color="#1565c0" />
            <Text fontSize={14} fontWeight="700" color="#1565c0">ADD NEW CARD</Text>
          </XStack>
          <ChevronDown size={18} color={colors.textMuted} />
        </XStack>
      </TouchableOpacity>
    </Group>

    <Group title="UPI" noCollapse>
      <Banner Icon={Zap} text="Instant Refunds on Returns" />
      <Divider />
      <MethodRow
        id="upi_gpay"
        Icon={Wallet}
        label="Google Pay"
        selected={selected === 'upi_gpay'}
        onSelect={onSelect}
      />
    </Group>

    <Group title="Wallet" defaultOpen={false}>
      <MethodRow
        id="wallet_phonepe"
        Icon={Wallet}
        label="PhonePe"
        sublabel="PhonePe, Mobikwik & more"
        selected={selected === 'wallet_phonepe'}
        onSelect={onSelect}
      />
    </Group>

    <Group title="Net banking" defaultOpen={false}>
      <MethodRow
        id="netbanking"
        Icon={Building2}
        label="Select from a list of banks"
        selected={selected === 'netbanking'}
        onSelect={onSelect}
      />
    </Group>

    <Group title="Cash On Delivery" defaultOpen={false}>
      <MethodRow
        id="cod"
        Icon={Banknote}
        label="Cash On Delivery"
        sublabel="Extra Rs. 35 handling charges"
        selected={selected === 'cod'}
        onSelect={onSelect}
      />
    </Group>
  </View>
);

export default PaymentMethodList;

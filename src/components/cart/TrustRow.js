import React from 'react';
import { Text, View, XStack, YStack } from 'tamagui';
import { BadgeCheck, PackageCheck, ShieldCheck } from '@tamagui/lucide-icons';
import { colors } from '../../utils/theme';

const Pillar = ({ Icon, label }) => (
  <YStack alignItems="center" flex={1} gap={6}>
    <Icon size={28} color={colors.textMuted} />
    <Text fontSize={11} fontWeight="600" color={colors.textMuted} textAlign="center">
      {label}
    </Text>
  </YStack>
);

const TrustRow = () => (
  <View
    backgroundColor={colors.surface}
    borderRadius={8}
    paddingVertical={16}
    paddingHorizontal={12}
  >
    <XStack>
      <Pillar Icon={BadgeCheck} label={`QUALITY\nASSURED`} />
      <Pillar Icon={ShieldCheck} label={`100% SECURE\nPAYMENTS`} />
      <Pillar Icon={PackageCheck} label={`EASY RETURNS &\nREFUNDS`} />
    </XStack>
  </View>
);

export default TrustRow;

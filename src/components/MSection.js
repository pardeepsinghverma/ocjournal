import React from 'react';
import MTitle from './MTitle';
import { ScrollView, View, XStack } from 'tamagui';

const MSection = ({ title, titleLevel, ScrollDirection, ChildGap, children }) => {
  const isHorizontal = ScrollDirection === 'horizontal';
  return (
    // Vertical lists need a bounded height so the inner ScrollView can scroll;
    // horizontal rails stay content-sized.
    <View marginBottom={10} flex={isHorizontal ? undefined : 1}>
      {
        title && <MTitle title={title} level={titleLevel ?? '4'} />
      }
      <ScrollView
        horizontal={isHorizontal}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={isHorizontal ? undefined : { paddingBottom: 16 }}
      >
        <XStack flexWrap="wrap" gap={ChildGap ?? 8} alignItems="center">
          {children}
        </XStack>
      </ScrollView>
    </View>
  );
};

export default MSection;

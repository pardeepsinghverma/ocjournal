import React from 'react';
import MTitle from './MTitle';
import { ScrollView, View, XStack } from 'tamagui';

const MSection = ({ title, titleLevel, ScrollDirection, ChildGap, children }) => {
  return (
    <View marginBottom={10}>
      {
        title && <MTitle title={title} level={titleLevel ?? '4'} />
      }
      <ScrollView
        horizontal={ScrollDirection === 'horizontal'}
        showsHorizontalScrollIndicator={false}
      >
        <XStack flexWrap="wrap" gap={ChildGap ?? 8} alignItems="center">
          {children}
        </XStack>
      </ScrollView>
    </View>
  );
};

export default MSection;

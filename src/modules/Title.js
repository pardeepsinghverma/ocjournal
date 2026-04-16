import React from 'react';
import { View, YStack, Text } from 'tamagui';
import MTitle from '../components/MTitle';

const Title = ({ options }) => {
  if (!options || !options.status) return null;

  const {
    title,
    subtitle,
    inline_button_text,
    inline_button_link
  } = options;

  return (
    <YStack marginBottom={12} marginTop={20}>
      <MTitle 
        title={title}
        marginTop={0}
        marginBottom={4}
        endTitle={inline_button_text}
        endLink={inline_button_link?.href}
      />
      {subtitle ? (
        <Text 
          fontSize={14} 
          color="$gray10" 
          lineHeight={18}
          opacity={0.8}
        >
          {subtitle}
        </Text>
      ) : null}
    </YStack>
  );
};

export default Title;

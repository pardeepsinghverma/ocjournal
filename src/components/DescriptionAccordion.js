import { Plus } from '@tamagui/lucide-icons';
import React from 'react';
import { Accordion, Paragraph, Square, View } from 'tamagui';

const DescriptionAccordion = ({ title, content, ...props }) => {
  return (
    <Accordion overflow="hidden" type="multiple" width={'100%'} props>
      <Accordion.Item value="a1">
        <Accordion.Trigger flexDirection="row" width={'100%'} justifyContent="space-between" alignItems="center">
          {({ open }) => (
            <>
              <View flex={1}>{title}</View>
              <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                <Plus size={20} />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.HeightAnimator animation="medium">
          <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
            <Paragraph opacity={0.7}>{content}</Paragraph>
          </Accordion.Content>
        </Accordion.HeightAnimator>
      </Accordion.Item>
    </Accordion>
  );
};

export default DescriptionAccordion;

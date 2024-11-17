import { Plus } from '@tamagui/lucide-icons';
import React from 'react';
import { Accordion, Paragraph, Square } from 'tamagui';

const MAccordion = ({ title, content }) => {
  return (
    <Accordion overflow="hidden" type="multiple">
      <Accordion.Item value="a1">
        <Accordion.Trigger flexDirection="row" justifyContent="space-between" padding={0} borderWidth={0} alignItems="center">
          {({ open }) => (
            <>
              <Paragraph>{title}</Paragraph>
              <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                <Plus size={20} />
              </Square>
            </>
          )}
        </Accordion.Trigger>
        <Accordion.HeightAnimator animation="medium">
          <Accordion.Content animation="medium" exitStyle={{ opacity: 0 }}>
            <Paragraph>{content}</Paragraph>
          </Accordion.Content>
        </Accordion.HeightAnimator>
      </Accordion.Item>
    </Accordion>
  );
};

export default MAccordion;

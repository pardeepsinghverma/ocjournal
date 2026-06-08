import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Image, Paragraph, Text, XStack, YStack } from 'tamagui';
import { getPlaceholderImage } from '../utils/getImage';

/**
 * Layout module: `testimonials` (customer reviews carousel).
 *
 * Engine passes `data` = item.item.data.items (keyed object of review items,
 * each `{ content, footerText, image }`) and `options` = item.item.data.
 *
 * See docs/modules/testimonials.md.
 */
const Testimonials = ({ data, options }) => {
  if (options?.status === false) return null;

  const items = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
  const reviews = items.filter(it => it?.content);
  if (!reviews.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12, paddingVertical: 6, paddingHorizontal: 2 }}
    >
      {reviews.map((r, i) => (
        <Card
          key={r.id ?? i}
          width={280}
          bordered
          borderRadius="$4"
          backgroundColor="#ffffff"
          padding={16}
        >
          <YStack gap={12}>
            <Paragraph fontSize={14} lineHeight={20} color="#333333" numberOfLines={5}>
              “{r.content}”
            </Paragraph>
            <XStack gap={10} alignItems="center">
              <Image
                src={getPlaceholderImage(r.image, 40, 40, '')}
                width={40}
                height={40}
                borderRadius={20}
              />
              <Text fontSize={13} fontWeight="600" color="#141414">
                {(r.footerText || '').replace(/^[-\s]+/, '')}
              </Text>
            </XStack>
          </YStack>
        </Card>
      ))}
    </ScrollView>
  );
};

export default Testimonials;

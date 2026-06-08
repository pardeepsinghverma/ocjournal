import React from 'react';
import { ScrollView } from 'react-native';
import { Image, Text, YStack } from 'tamagui';
import { getPlaceholderImage } from '../utils/getImage';

/**
 * Layout module: `gallery` (image carousel).
 *
 * Engine passes `data` = item.item.data.items (keyed object of image items,
 * each `{ type, title, thumb, popup }`) and `options` = item.item.data.
 *
 * See docs/modules/gallery.md.
 */
const Gallery = ({ data, options }) => {
  if (options?.status === false) return null;

  const items = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
  const images = items.filter(it => it?.thumb || it?.popup || it?.type === 'image');
  if (!images.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingVertical: 6, paddingHorizontal: 2 }}
    >
      {images.map((g, i) => (
        <YStack key={g.id ?? i} width={200} gap={6}>
          <Image
            src={getPlaceholderImage(g.thumb || g.popup, 200, 200, 'Gallery')}
            width={200}
            height={200}
            borderRadius="$4"
            objectFit="cover"
          />
          {g.title ? (
            <Text fontSize={12} color="#555555" numberOfLines={1}>
              {g.title}
            </Text>
          ) : null}
        </YStack>
      ))}
    </ScrollView>
  );
};

export default Gallery;

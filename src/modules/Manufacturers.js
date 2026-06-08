import React from 'react';
import { ScrollView } from 'react-native';
import { Card, Image, Text } from 'tamagui';
import { getPlaceholderImage } from '../utils/getImage';

/**
 * Layout module: `manufacturers` (brand / "Our Partners" strip).
 *
 * Engine passes `data` = item.item.data.items (keyed object of tabs). Each tab
 * carries a `manufacturers` keyed object of `{ manufacturer_id, thumb, name, href }`.
 * `options` = item.item.data.
 *
 * See docs/modules/manufacturers.md.
 */
const collectBrands = data => {
  const tabs = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
  const out = [];
  for (const tab of tabs) {
    if (tab?.manufacturers) out.push(...Object.values(tab.manufacturers));
  }
  return out;
};

const Manufacturers = ({ data, options }) => {
  if (options?.status === false) return null;

  const brands = collectBrands(data);
  if (!brands.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingVertical: 6, paddingHorizontal: 2 }}
    >
      {brands.map((b, i) => (
        <Card
          key={b.manufacturer_id ?? i}
          width={120}
          height={110}
          bordered
          borderRadius="$4"
          backgroundColor="#ffffff"
          alignItems="center"
          justifyContent="center"
          padding={10}
        >
          <Image
            src={getPlaceholderImage(b.thumb, 90, 50, 'Brand')}
            width={90}
            height={50}
            objectFit="contain"
          />
          <Text fontSize={12} numberOfLines={1} marginTop={8} color="#141414">
            {b.name}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
};

export default Manufacturers;

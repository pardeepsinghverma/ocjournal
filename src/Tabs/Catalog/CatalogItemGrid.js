import React from 'react';
import { ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Text, View } from 'tamagui';
import { colors } from '../../utils/theme';

const SIDEBAR_WIDTH = 110;
const COLUMNS = 2;
const H_PADDING = 12;
const GAP = 12;

const CatalogItemGrid = ({ items = [], onItemPress }) => {
  const { width } = useWindowDimensions();
  const available = width - SIDEBAR_WIDTH - H_PADDING * 2 - GAP * (COLUMNS - 1);
  const cellSize = Math.max(80, Math.floor(available / COLUMNS));
  const circleSize = Math.floor(cellSize * 0.88);

  if (!items.length) {
    return (
      <View flex={1} alignItems="center" justifyContent="center" padding={24}>
        <Text color={colors.textSubtle} fontSize={13}>
          No items in this category
        </Text>
      </View>
    );
  }

  return (
    <View flex={1} backgroundColor={colors.surface}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: H_PADDING,
          paddingVertical: 16,
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: GAP,
        }}
      >
        {items.map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onItemPress?.(item)}
            activeOpacity={0.8}
            style={{ width: cellSize, alignItems: 'center', marginBottom: 8 }}
          >
            <View
              width={circleSize}
              height={circleSize}
              borderRadius={circleSize / 2}
              backgroundColor={colors.surfaceMuted}
              overflow="hidden"
              alignItems="center"
              justifyContent="center"
            >
              {item.image ? (
                <Image
                  source={{ uri: item.image }}
                  style={{ width: circleSize, height: circleSize }}
                  resizeMode="cover"
                />
              ) : null}
            </View>
            <Text
              marginTop={8}
              fontSize={13}
              fontWeight="500"
              color={colors.text}
              textAlign="center"
              numberOfLines={2}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CatalogItemGrid;

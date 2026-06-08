import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from 'tamagui';
import { colors } from '../../utils/theme';

const SIDEBAR_WIDTH = 110;

const CatalogSidebar = ({ categories = [], activeId, onSelect }) => {
  return (
    <View
      width={SIDEBAR_WIDTH}
      backgroundColor={colors.surfaceMuted}
      borderRightWidth={1}
      borderRightColor={colors.borderSoft}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 4 }}
      >
        {categories.map(cat => {
          const isActive = cat.id === activeId;
          return (
            <TouchableOpacity
              key={cat.id}
              onPress={() => onSelect?.(cat.id)}
              activeOpacity={0.7}
            >
              <View
                paddingVertical={18}
                paddingHorizontal={12}
                backgroundColor={isActive ? colors.surface : 'transparent'}
                flexDirection="row"
                alignItems="center"
              >
                <View
                  width={3}
                  height={22}
                  backgroundColor={isActive ? colors.accent : 'transparent'}
                  borderRadius={2}
                  marginRight={8}
                />
                <Text
                  flex={1}
                  fontSize={13}
                  fontWeight={isActive ? '700' : '500'}
                  color={isActive ? colors.text : colors.textMuted}
                >
                  {cat.name}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default CatalogSidebar;

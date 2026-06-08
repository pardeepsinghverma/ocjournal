import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text, View, XStack } from 'tamagui';
import { colors } from '../../utils/theme';

const CatalogTopTabs = ({ tabs = [], activeId, onChange }) => {
  if (!tabs.length) return null;

  return (
    <View
      backgroundColor={colors.surface}
      borderBottomWidth={1}
      borderBottomColor={colors.borderSoft}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <XStack flex={1} justifyContent="space-around">
          {tabs.map(tab => {
            const isActive = tab.id === activeId;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => onChange?.(tab.id)}
                style={{ flex: 1, minWidth: 110 }}
                activeOpacity={0.7}
              >
                <View
                  paddingVertical={14}
                  paddingHorizontal={16}
                  alignItems="center"
                  borderBottomWidth={3}
                  borderBottomColor={isActive ? colors.accent : 'transparent'}
                >
                  <Text
                    fontSize={14}
                    fontWeight={isActive ? '700' : '600'}
                    color={isActive ? colors.text : colors.textMuted}
                    letterSpacing={0.5}
                  >
                    {tab.name?.toUpperCase()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </XStack>
      </ScrollView>
    </View>
  );
};

export default CatalogTopTabs;

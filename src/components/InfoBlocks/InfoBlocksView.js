import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RichText } from '../Slider/RichText';
import { getColorScheme } from '../Slider/colorSchemes';
import InfoBlockItem from './InfoBlockItem';

// Journal3 "Info Blocks / Site Features" — a vertical stack of feature rows,
// each row showing an icon circle + title + optional description text.
// The web SIMPLE style renders them in a horizontal strip (desktop) or stacked
// column (mobile). We mirror the mobile layout: full-width cards stacked
// vertically, with a thin separator between items.
const InfoBlocksView = ({ items, moduleColorScheme, moduleTitle, moduleDescription }) => {
  if (!items || items.length === 0) {
    return null;
  }

  const moduleScheme = getColorScheme(moduleColorScheme);

  return (
    <View style={styles.container}>
      {/* Optional module-level title and description */}
      {!!moduleTitle && (
        <RichText
          html={moduleTitle}
          color={moduleScheme.text}
          fontSize={16}
          fontWeight="700"
          style={styles.moduleTitle}
        />
      )}
      {!!moduleDescription && (
        <RichText
          html={moduleDescription}
          color={moduleScheme.muted}
          fontSize={13}
          fontWeight="400"
          style={styles.moduleDescription}
        />
      )}

      {/* Item rows */}
      {items.map((item, index) => {
        // Per-item color_scheme overrides the module-level one.
        const itemScheme = getColorScheme(item.colorScheme || moduleColorScheme);
        const isLast = index === items.length - 1;
        return (
          <View key={item.id || String(index)}>
            <InfoBlockItem
              item={item}
              scheme={itemScheme}
            />
            {!isLast && (
              <View style={[styles.divider, { backgroundColor: itemScheme.muted + '30' }]} />
            )}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  moduleTitle: {
    marginBottom: 4,
    marginHorizontal: 14,
    marginTop: 4,
  },
  moduleDescription: {
    marginBottom: 10,
    marginHorizontal: 14,
  },
  divider: {
    height: 1,
    marginHorizontal: 14,
  },
});

export default InfoBlocksView;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { RichText } from '../Slider/RichText';
import { getColorScheme } from '../Slider/colorSchemes';
import InfoBlockItem from './InfoBlockItem';

/**
 * Journal3 "Info Blocks / Site Features" — a vertical stack of feature rows,
 * each row showing an icon circle + title + optional description text.
 * The web SIMPLE style renders them in a horizontal strip (desktop) or stacked
 * column (mobile). We mirror the mobile layout: full-width cards stacked
 * vertically, with a thin separator between items.
 *
 * Props:
 *   items              — normalized item array
 *   columns            — column count derived from options.itemsPerRow.sc[0].items
 *                        (API value: 1 on phone → full-width vertical stack, which is
 *                        exactly what this component renders)
 *   moduleColorScheme  — module-level color scheme key string
 *   moduleTitle        — optional module heading (HTML)
 *   moduleDescription  — optional module subheading (HTML)
 *
 * NOTE: `columns` is currently always 1 on phone per the Journal3 API.
 * The prop is accepted so the view can adapt if the API ever returns columns > 1.
 */
// eslint-disable-next-line no-unused-vars
const InfoBlocksView = ({ items, columns = 1, moduleColorScheme, moduleTitle, moduleDescription }) => {
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

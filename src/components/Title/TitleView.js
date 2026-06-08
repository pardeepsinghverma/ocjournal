import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RichText } from '../common/RichText';

// Resolve a Journal3 link object to a navigation call.
// Gracefully no-ops for unknown link types.
const navigateTo = (navigation, link) => {
  if (!link || typeof link !== 'object') return;
  if (link.type === 'product' && link.id) {
    navigation.navigate('productView', { productId: link.id });
    return;
  }
  if (link.type === 'category' && link.id) {
    navigation.navigate('catalog', { categoryId: link.id });
  }
  // Other link types (page, information, etc.) have no matching RN route —
  // press is wired but no-ops gracefully.
};

// Map options.style / options.classes to a heading scale.
// Journal3 "MODULE TITLE" style uses a slightly smaller heading than "DEFAULT".
const headingSizeFromStyle = (style) => {
  if (!style) return 22;
  const upper = String(style).toUpperCase();
  if (upper === 'DEFAULT') return 24;
  if (upper.includes('MODULE TITLE') || upper.includes('MODULE')) return 20;
  return 22;
};

// Derive text-alignment from an alignment string or from classes array.
// Falls back to 'left' — never hardcoded for a specific tenant.
const resolveAlignment = (alignment, classes) => {
  if (alignment) {
    const a = String(alignment).toLowerCase();
    if (a === 'center' || a === 'centre') return 'center';
    if (a === 'right') return 'right';
    if (a === 'left') return 'left';
  }
  // Journal3 stores layout info in the classes array as e.g. "text-center".
  if (Array.isArray(classes)) {
    const cls = classes.filter(Boolean).join(' ').toLowerCase();
    if (cls.includes('text-center') || cls.includes('center')) return 'center';
    if (cls.includes('text-right') || cls.includes('right')) return 'right';
  }
  return 'left';
};

const TitleView = ({
  title,
  subtitle,
  inlineButtonText,
  inlineButtonLink,
  style: styleName,
  alignment,
  classes,
  scheme,
}) => {
  const navigation = useNavigation();

  const textAlign = resolveAlignment(alignment, classes);
  const headingSize = headingSizeFromStyle(styleName);
  const hasInlineButton = !!(inlineButtonText && inlineButtonText.trim());

  // Divider should align with text: 'flex-start' for left, 'center' for center,
  // 'flex-end' for right.
  const dividerAlign =
    textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start';

  return (
    <View style={styles.container}>
      {/* Title row: heading + optional inline "view all" button */}
      <View style={[styles.titleRow, { justifyContent: hasInlineButton ? 'space-between' : dividerAlign }]}>
        {title ? (
          <RichText
            html={title}
            color={scheme.text}
            fontSize={headingSize}
            fontWeight="700"
            style={[styles.heading, { textAlign, flexShrink: 1 }]}
          />
        ) : null}

        {hasInlineButton ? (
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => navigateTo(navigation, inlineButtonLink)}
            style={styles.inlineButton}
          >
            <RichText
              html={inlineButtonText}
              color={scheme.accent}
              fontSize={13}
              fontWeight="600"
              style={styles.inlineButtonText}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Decorative accent divider */}
      <View style={[styles.dividerRow, { alignItems: dividerAlign }]}>
        <View style={[styles.divider, { backgroundColor: scheme.accent }]} />
      </View>

      {/* Optional subtitle */}
      {subtitle && subtitle.trim() ? (
        <RichText
          html={subtitle}
          color={scheme.muted}
          fontSize={14}
          fontWeight="400"
          lineHeight={20}
          style={[styles.subtitle, { textAlign }]}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heading: {
    // textAlign injected inline from options
  },
  inlineButton: {
    paddingLeft: 8,
    flexShrink: 0,
  },
  inlineButtonText: {
    // color and size driven by scheme
  },
  dividerRow: {
    marginTop: 6,
    marginBottom: 8,
    flexDirection: 'row',
  },
  divider: {
    height: 2,
    width: 36,
    borderRadius: 1,
  },
  subtitle: {
    marginTop: 2,
    lineHeight: 20,
  },
});

export default TitleView;

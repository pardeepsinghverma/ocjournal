import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RichText } from '../common/RichText';

// Resolve a Journal3 link object to a navigation action.
// Returns a no-op function when the link cannot be resolved.
const resolveLink = (navigation, link) => {
  if (!link || !navigation) return null;
  if (link.type === 'product' && link.id) {
    return () => navigation.navigate('productView', { productId: link.id });
  }
  if (link.type === 'category' && link.id) {
    return () => navigation.navigate('catalog', { categoryId: link.id });
  }
  if (link.href && link.href.trim() !== '') {
    // External / unrecognised href — no-op (no WebView route in this app yet).
    return () => {};
  }
  return null;
};

// A single marquee item: may be tappable if it carries a real link.
const MarqueeItem = ({ item, textColor, separatorChar }) => {
  const navigation = useNavigation();
  const onPress = resolveLink(navigation, item.link);

  const content = (
    <View style={styles.itemRow}>
      <RichText
        html={item.title}
        color={textColor}
        fontSize={13}
        fontWeight="600"
      />
      {!!separatorChar && (
        <RichText
          html={separatorChar}
          color={textColor}
          fontSize={11}
          fontWeight="400"
          style={styles.separator}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.75} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

/**
 * MarqueeView
 *
 * Props:
 *   items           – array of { id, title (HTML), link }
 *   speed           – pixels per second the strip scrolls (from options.speed)
 *   direction       – 'ltr' | 'rtl' (default 'ltr' = scroll leftward)
 *   separator       – string placed between items (may be empty)
 *   scheme          – { surface, text, accent, muted } from getColorScheme()
 *   backgroundColor – resolved row background color (from resolveRowBackground); falls
 *                     back to scheme.surface when null
 *   isFullWidth     – when true the strip applies negative horizontal margins to bleed
 *                     past HomeScreen's paddingHorizontal={14}
 */
const MarqueeView = ({ items, speed, direction, separator, scheme, backgroundColor, isFullWidth }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);

  // Pixels-per-second from options.speed; fall back to a sane default.
  // Journal3 stores speed as a numeric string (e.g. "50") representing px/s.
  const pxPerSec = Math.max(10, Number(speed) || 50);

  // direction: 'rtl' scrolls right-to-left (text enters from the right, exits left).
  // 'ltr' reverses this. Journal3 default is rtl (classic ticker direction).
  const scrollLeft = String(direction).toLowerCase() !== 'ltr';

  useEffect(() => {
    if (!contentWidth) return undefined;

    const startValue = scrollLeft ? 0 : -contentWidth;
    const endValue = scrollLeft ? -contentWidth : 0;
    const durationMs = (contentWidth / pxPerSec) * 1000;

    translateX.setValue(startValue);
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: endValue,
        duration: durationMs,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [contentWidth, pxPerSec, scrollLeft, translateX]);

  if (!items || items.length === 0) return null;

  const separatorChar = separator != null ? String(separator) : '●';

  // Render one full pass of items; double it so the loop wraps seamlessly.
  const renderRun = (runKey, onLayout) => (
    <View
      key={runKey}
      style={styles.run}
      onLayout={onLayout}
    >
      {items.map((item) => (
        <MarqueeItem
          key={item.id}
          item={item}
          textColor={scheme.text}
          separatorChar={separatorChar}
        />
      ))}
    </View>
  );

  // backgroundColor prop takes priority; null → fall back to scheme.surface.
  const stripBg = backgroundColor ?? scheme.surface;

  return (
    <View
      style={[
        styles.strip,
        { backgroundColor: stripBg },
        isFullWidth && styles.fullWidth,
      ]}
    >
      <Animated.View
        style={[styles.track, { transform: [{ translateX }] }]}
      >
        {renderRun('a', (e) => setContentWidth(e.nativeEvent.layout.width))}
        {renderRun('b')}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  strip: {
    height: 40,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  // Cancels HomeScreen's paddingHorizontal={14} so the strip bleeds to screen edges.
  fullWidth: {
    marginHorizontal: -14,
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  run: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    marginHorizontal: 14,
    opacity: 0.55,
  },
});

export default MarqueeView;

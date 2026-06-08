import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { Text, View, XStack } from 'tamagui';
import { colors } from '../utils/theme';

/**
 * Layout module: `marquee`
 *
 * A continuously scrolling promo strip (e.g. "Free Shipping • On orders over $200").
 * The engine passes `data` = item.item.data.items (keyed object of message items,
 * each shaped `{ type, title }`) and `options` = item.item.data.
 *
 * See docs/modules/marquee.md.
 */
const Marquee = ({ data, options }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [contentWidth, setContentWidth] = useState(0);

  const items = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
  const messages = items.map(it => it?.title).filter(Boolean);

  useEffect(() => {
    if (!contentWidth) return undefined;
    translateX.setValue(0);
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -contentWidth,
        duration: contentWidth * 22, // px-per-ms pace; lower = faster
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    anim.start();
    return () => anim.stop();
  }, [contentWidth, translateX]);

  if (!messages.length || options?.status === false) return null;

  // One full pass of the messages; rendered twice so the loop wraps seamlessly.
  const renderRun = (key, onLayout) => (
    <XStack key={key} alignItems="center" onLayout={onLayout}>
      {messages.map((m, i) => (
        <XStack key={i} alignItems="center">
          <Text color="#ffffff" fontSize={13} fontWeight="600">
            {m}
          </Text>
          <Text color="#ffffff" fontSize={10} opacity={0.6} paddingHorizontal={18}>
            ●
          </Text>
        </XStack>
      ))}
    </XStack>
  );

  return (
    <View
      height={38}
      borderRadius={8}
      backgroundColor={colors.text}
      justifyContent="center"
      overflow="hidden"
    >
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX }] }}>
        {renderRun('a', e => setContentWidth(e.nativeEvent.layout.width))}
        {renderRun('b')}
      </Animated.View>
    </View>
  );
};

export default Marquee;

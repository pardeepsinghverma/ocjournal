import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Dimensions, Easing, View } from 'react-native';

const COLORS = [
  '#ff7a00',
  '#ffffff',
  '#20c997',
  '#ff3b82',
  '#fdcb00',
  '#3bb4ff',
  '#34d399',
  '#f472b6',
];

const Piece = ({
  startX,
  startY,
  horizontalDistance,
  peakHeight,
  fallDepth,
  rotate,
  color,
  size,
  duration,
  delay,
}) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [progress, duration, delay]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, horizontalDistance],
  });
  const translateY = progress.interpolate({
    inputRange: [0, 0.35, 1],
    outputRange: [0, peakHeight, peakHeight + fallDepth],
  });
  const rotateZ = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', `${rotate}deg`],
  });
  const opacity = progress.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 1, 0],
  });

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: startX,
        top: startY,
        width: size,
        height: size * 0.4,
        backgroundColor: color,
        borderRadius: 2,
        transform: [{ translateX }, { translateY }, { rotateZ }],
        opacity,
      }}
    />
  );
};

const Confetti = ({ trigger, pieces = 36, duration = 1600, width, height }) => {
  const screen = Dimensions.get('window');
  const areaWidth = width || screen.width;
  const areaHeight = height || 160;

  const items = useMemo(() => {
    if (!trigger) return [];
    const centerX = areaWidth / 2;
    const centerY = areaHeight * 0.6;

    return Array.from({ length: pieces }).map(() => {
      const angle = -Math.PI * (0.15 + Math.random() * 0.7);
      const speed = 90 + Math.random() * (areaWidth * 0.55);
      return {
        startX: centerX,
        startY: centerY,
        horizontalDistance: Math.cos(angle) * speed,
        peakHeight: Math.sin(angle) * speed * 0.85,
        fallDepth: areaHeight + 60 + Math.random() * 80,
        rotate: (Math.random() - 0.5) * 900,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 7,
        duration: duration + Math.random() * 500,
        delay: Math.random() * 120,
      };
    });
  }, [trigger, pieces, duration, areaWidth, areaHeight]);

  if (!trigger || items.length === 0) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      {items.map((p, i) => (
        <Piece key={`${trigger}-${i}`} {...p} />
      ))}
    </View>
  );
};

export default Confetti;

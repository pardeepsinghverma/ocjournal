import React, { useCallback } from 'react';
import { SlideItem } from './SlideItem';

export const renderItem = ({ rounded = false, style, currentIndex } = {}) =>
  useCallback(
    ({ item, index }) => (
      <SlideItem
        key={item.id || index} // Prefer unique keys if available
        index={index}
        rounded={rounded}
        style={style}
        slideData={item}
        currentIndex={currentIndex} // Pass currentIndex down
      />
    ),
    [rounded, style, currentIndex]
  );

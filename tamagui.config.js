// tamagui.config.js
import { createTamagui } from '@tamagui/core';

const config = createTamagui({
  tokens: {
    // Define tokens here (colors, spacing, sizes, etc.)
  },
  themes: {
    // Define themes here
  },
  fonts: {
    body: {
      family: 'Arial',
      weight: {
        400: 'normal',
        700: 'bold',
      },
      size: {
        1: 12,
        2: 14,
        3: 16,
      },
      lineHeight: {
        1: 16,
        2: 20,
        3: 24,
      },
    },
  },
  shorthands: {
    // Define shorthands for styling here
  },
});

export default config;

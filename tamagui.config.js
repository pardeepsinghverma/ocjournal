// tamagui.config.js
import { createTamagui } from '@tamagui/core'

const config = createTamagui({
  tokens: {

    color: {
      primary: '#000000',
      secondary: '#666666',
      background: '#ffffff',
      muted: '#f5f5f5',
      success: '#16a34a',
      danger: '#dc2626',
      warning: '#f59e0b',
      border: '#e5e5e5'
    },

    space: {
      0: 0,
      1: 4,
      2: 8,
      3: 12,
      4: 16,
      5: 20,
      6: 24,
      7: 32,
      8: 40
    },

    size: {
      0: 0,
      1: 12,
      2: 14,
      3: 16,
      4: 18,
      5: 20,
      6: 24,
      7: 28,
      8: 32
    },

    radius: {
      0: 0,
      1: 4,
      2: 6,
      3: 8,
      4: 12,
      5: 16,
      round: 999
    },

  },

  themes: {
    light: {
      background: '#ffffff',
      color: '#000000',
      primary: '#000000',
      secondary: '#666666',
      borderColor: '#e5e5e5',
    },

    dark: {
      background: '#000000',
      color: '#ffffff',
      primary: '#ffffff',
      secondary: '#aaaaaa',
      borderColor: '#333333',
    },
  },

  fonts: {
    body: {
      family: 'Arial',
      weight: {
        400: 'normal',
        500: '500',
        600: '600',
        700: 'bold',
      },
      size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 20
      },
      lineHeight: {
        1: 16,
        2: 20,
        3: 24,
        4: 28
      },
    },
  },

  shorthands: {
    p: 'padding',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',

    m: 'margin',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',

    bg: 'backgroundColor',
    br: 'borderRadius',

    w: 'width',
    h: 'height',
  },

})

export default config
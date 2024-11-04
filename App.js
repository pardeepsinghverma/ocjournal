import { enableScreens } from 'react-native-screens';
enableScreens();

import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import App from './src/App';
import { Text } from 'react-native';

const tamaguiConfig = createTamagui(config);

export default () => {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <App />
    </TamaguiProvider>
  );
};


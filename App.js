import { enableScreens } from 'react-native-screens';
enableScreens();

import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3'; // Importing config from v3
import App from './src/App';
import { PortalProvider } from 'tamagui'; // Make sure to use this to avoid portal-related errors
import { Provider } from 'react-redux';
import store from './src/store/store';

// Creating Tamagui configuration using createTamagui
const tamaguiConfig = createTamagui(config);

export default () => {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <PortalProvider>
        <Provider store={store}>
          <App />
        </Provider>
      </PortalProvider>
    </TamaguiProvider>
  );
};

// main.js or wherever your main component is
import { enableScreens } from "react-native-screens";
enableScreens();

import { TamaguiProvider, createTamagui } from "@tamagui/core";
import { config } from "@tamagui/config/v3";
import App from "./src/App";
import { PortalProvider } from "tamagui";
import { Provider } from "react-redux";
import store, { persistor } from "./src/store/store"; // Import persistor
import { PersistGate } from "redux-persist/integration/react";

// Creating Tamagui configuration using createTamagui
const tamaguiConfig = createTamagui(config);

export default () => {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <PortalProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </PortalProvider>
    </TamaguiProvider>
  );
};

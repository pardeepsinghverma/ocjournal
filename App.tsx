import { TamaguiProvider, createTamagui } from '@tamagui/core';
import { config } from '@tamagui/config/v3';
import { Provider } from 'react-redux';
import { ProductCard } from './src/components/products/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_DOMAIN, API_ENDPOINTS, HELPING_DOMAIN } from './src/api/const';
import { useDispatch } from 'react-redux';
import { setItem } from './src/redux/itemsSlice';
import store from './src/redux/store';
import Home from './src/screens/home/Page';

// Tamagui configuration
const tamaguiConfig = createTamagui(config);

type Conf = typeof tamaguiConfig;
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export default function App() {

  return (
    <Provider store={store}>
      <TamaguiProvider config={tamaguiConfig}>
        <Home />
      </TamaguiProvider>
    </Provider>
  );
}

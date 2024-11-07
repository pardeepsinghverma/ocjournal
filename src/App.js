// src/App.js
import React from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import DrawerNavigator from './navigation/DrawerNavigator';
import { Provider } from 'react-redux';
import store from './store/store';
import StackNavigator from './navigation/stackNavigator';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CatalogScreen from './screens/CatalogScreen';

export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <Provider store={store}>
      <NavigationContainer>
        {/* <DrawerNavigator /> */}
        {/* <StackNavigator /> */}
        <Stack.Navigator initialRouteName="main">
          <Stack.Screen name="main" component={DrawerNavigator} options={{headerShown:false}} />
          <Stack.Screen name="child" component={StackNavigator} />
          <Stack.Screen name="category" component={CatalogScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
//;
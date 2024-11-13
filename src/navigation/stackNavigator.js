// src/navigation/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Tabs/Home/HomeScreen';
import CatalogScreen from '../Tabs/Catalog/CatalogScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="category" component={CatalogScreen} />
    </Stack.Navigator>
  );
}

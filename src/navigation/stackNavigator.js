// src/navigation/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import { TouchableOpacity } from 'react-native';
import { Text } from 'tamagui';
import DrawerNavigator from './DrawerNavigator';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="category" component={CatalogScreen} />
      <Stack.Screen name="Navigation2" component={DrawerNavigator} />
    </Stack.Navigator>
  );
}

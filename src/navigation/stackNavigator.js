// src/navigation/StackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Category"
        component={CatalogScreen}
        options={({ route }) => ({
          title: route.params.categoryName,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text>{'< Back'}</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity>
              <Text>🛒</Text> {/* Cart Icon */}
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}

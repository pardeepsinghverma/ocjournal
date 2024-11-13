// src/navigation/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import { Image, View } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import { Search, Heart, ShoppingCart } from '@tamagui/lucide-icons'; // Importing Lucide icons

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen 
        name="MainTabs" 
        component={BottomTabNavigator} 
        options={{
          headerShown: true,
          headerStyle: {
            backgroundColor: '#febf00', // Set your desired background color here
          },
          headerTintColor: '#000', // Set your desired text color here
          headerRight: () => (
            <View marginEnd={10} flex={1} flexDirection='row' gap={20} alignItems='center'>
              <TouchableOpacity>
                <Search size={22} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Heart size={22} color="#000" />
              </TouchableOpacity>
              <TouchableOpacity>
                <ShoppingCart size={22} color="#000" />
              </TouchableOpacity>
            </View>
          ),
          headerTitle: () => (
            <Image 
              src='https://downloadr2.apkmirror.com/wp-content/uploads/2023/05/37/646153f90d163.png' 
              style={{ width: 60, height: 30 }} 
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

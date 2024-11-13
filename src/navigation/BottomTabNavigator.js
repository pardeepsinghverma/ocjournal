// src/navigation/BottomTabNavigator.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Tabs/Home/HomeScreen';
import CatalogScreen from '../Tabs/Catalog/CatalogScreen';
import ProfileScreen from '../Tabs/ProfileScreen';
import MoreScreen from '../Tabs/MoreScreen';
import { EllipsisVertical, House, ShoppingBasket, UserRound } from '@tamagui/lucide-icons';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;

          switch (route.name) {
            case 'Home':
              IconComponent = House;
              break;
            case 'Catalog':
              IconComponent = ShoppingBasket;
              break;
            case 'Profile':
              IconComponent = UserRound;
              break;
            case 'More':
              IconComponent = EllipsisVertical;
              break;
            default:
              IconComponent = House;
          }

          return <IconComponent color={color} size={size} />;
        },
        tabBarActiveTintColor: '#000000', // Set the color for the active tab
        tabBarInactiveTintColor: '#00000040',  // Set the color for the inactive tabs
        tabBarLabelStyle: {
          fontWeight: 'bold',
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={CatalogScreen}
        options={{
          tabBarLabel: 'Catalog',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen
        name="More"
        component={MoreScreen}
        options={{
          tabBarLabel: 'More',
        }}
      />
    </Tab.Navigator>
  );
}

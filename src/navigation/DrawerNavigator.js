// src/navigation/DrawerNavigator.js
import React, { useEffect } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import BottomTabNavigator from './BottomTabNavigator';
import { Image, Text, View } from 'tamagui';
import { TouchableOpacity } from 'react-native';
import {
  Search,
  Heart,
  ShoppingCart,
  Bell,
  User,
  ShoppingBasket,
  Locate,
} from '@tamagui/lucide-icons';
import DescriptionAccordion from '../components/DescriptionAccordion';
import MAccordion from '../components/MAccordion';
import { useNavigation } from '@react-navigation/native';
import HeaderLogo from '../components/HeaderLogo';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const Navigation = [
    { id: 1, label: 'Login', icon: <User size={22} />, type: 'screen', navigate: 'login' },
    { id: 2, label: 'Search', icon: <Search size={22} />, type: 'screen', navigate: 'search' },
    { id: 3, label: 'New Product', icon: <ShoppingBasket size={22} />, type: 'screen', navigate: 'productView', parm: '34' },
    { id: 4, label: 'My Orders', icon: <ShoppingCart size={22} />, type: 'screen', navigate: 'myorders' },
    { id: 5, label: 'My Addresses', icon: <Locate size={22} />, type: 'screen', navigate: 'myaddresses' },
    { id: 6, label: 'My Profile', icon: <User size={22} />, type: 'screen', navigate: 'myprofile' },
    { id: 7, label: 'Catalog', icon: <ShoppingBasket size={22} />, type: 'screen', navigate: 'Catalog', parm: '34' },
    {
      id: 8,
      label: 'Popular',
      type: 'menu',
      child: [
        { id: 1, label: 'New Product', type: 'screen', navigate: 'productView' },
        { id: 2, label: 'My Orders', type: 'screen', navigate: 'myorders' },
        { id: 3, label: 'My Addresses', type: 'screen', navigate: 'myaddresses' },
        { id: 4, label: 'My Profile', type: 'screen', navigate: 'myprofile' },
      ],
    },
  ];

  return (
    <DrawerContentScrollView style={{width:'100%'}} {...props}>
      {Navigation.map((item, index) => (
        item.type === 'menu' ? (
          <DrawerItem
            key={index}
            style={{
              backgroundColor: 'transparent', // No background for the container
              margin: 0, // Remove any margins
              padding: 0, // Remove padding
            }}
            labelStyle={{
              margin: 0, // Remove any label margins
              padding: 0, // Remove padding from label
            }}
            label={() => (
              <MAccordion
                title={item.label}
                content={item.child.map((child, childIndex) => (
                  <DrawerItem
                    key={childIndex}
                    label={() => (
                      <View
                        style={{
                          height: 30,
                          overflow: 'hidden',
                          justifyContent: 'center',
                        }}
                      >
                        <Text style={{ lineHeight: 14 }}>{child.label}</Text>
                      </View>
                    )}
                    onPress={() => props.navigation.navigate(child.navigate)}
                  />
                ))}
              />
            )}
            onPress={() => {}}
          />

        ) : (
          <DrawerItem
            key={index}
            label={() => (
              <View
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Text style={{ marginLeft: 10 }}>{item.label}</Text>
                {item.icon}
              </View>
            )}
            onPress={() =>
              item.type === 'screen'
                ? props.navigation.navigate(item.navigate)
                : null
            }
          />
        )
      ))}
    </DrawerContentScrollView>
  );
}




export default function DrawerNavigator() {
  const navigation = useNavigation();
  
  
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#febf00',
        },
        drawerItemStyle: {
          backgroundColor: 'transparent',
          margin: 0,
          padding: 0,
        },
        headerTintColor: '#000',
        headerRight: () => (
          <View
            marginEnd={10}
            flexDirection="row"
            gap={20}
            alignItems="center"
          >
            {[
              { icon: <Search size={22} color="#000" />, navigate: 'search' },
              { icon: <Bell size={22} color="#000" />, navigate: 'notification' },
              { icon: <Heart size={22} color="#000" />, navigate: 'wishlist' },
              { icon: <ShoppingCart size={22} color="#000" />, navigate: 'cart' },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(item.navigate)}
              >
                {item.icon}
              </TouchableOpacity>
            ))}
          </View>
        ),
        headerTitle: () => <HeaderLogo />,
        drawerItemStyle: {
          backgroundColor: '#000000',
          margin: 0,
          padding: 0,
        },
      }}
    >
      <Drawer.Screen name="MainTabs" component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
}

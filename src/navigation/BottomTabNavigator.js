// src/navigation/BottomTabNavigator.js
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../Tabs/Home/HomeScreen';
import CatalogScreen from '../Tabs/Catalog/CatalogScreen';
import ProfileScreen from '../Tabs/ProfileScreen';
import MoreScreen from '../Tabs/MoreScreen';
import { EllipsisVertical, House, ShoppingBasket, UserRound } from '@tamagui/lucide-icons';
import { Image, Sheet, Text, YStack } from 'tamagui';
import { useDispatch, useSelector } from 'react-redux';
import SelectDropdown from '../components/SelectDropdown';
import { TouchableOpacity } from 'react-native';
import { setData } from '../store/dataSlice';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const currentSubDomain = useSelector(
    (state) => state.data.currentSubDomain
  );

  // 🔥 Example stores (replace with API later)
  const stores = [
    { label: 'Stylesphere', value: 'stylesphere' },
    { label: 'Fashion', value: 'fashion' }
  ];

  const handleSelectStore = (value) => {
    console.log('Switching to:', value);

    dispatch(setData({ name: 'currentSubDomain', data: value }));
    setOpen(false);
  };
  
  useEffect(() => {
    console.log('Current SubDomain:', currentSubDomain);
  }, [currentSubDomain]);

  
  return (
    <>
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
              case 'Store':
                IconComponent = ({ size }) => (
                  <Image
                    source={{ uri: currentSubDomain == 'stylesphere' ? "https://cdn.fathersolution.com/m/1/1476/0476/image/catalog/undefined/icons/LOGO.png" : "https://cdn.fathersolution.com/m/12/11178/0085/image/catalog/fathershops/fashion/fashion.png" }}
                    style={{
                      width: size + 6,
                      height: size + 6,
                      borderRadius: (size + 6) / 2,
                    }}
                  />
                );
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
          tabBarStyle: {
            height:50,
            paddingTop: 8,
            paddingBottom: 8,
          }
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
        <Tab.Screen
          name="Store"
          component={MoreScreen}
          options={{
            tabBarLabel: () => null,
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setOpen(true);
            }
          }}
        />
      </Tab.Navigator>
      <Sheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[40]}
        dismissOnSnapToBottom
        modal
      >
        <Sheet.Overlay />
        <Sheet.Frame padding="$4">
          <YStack gap="$3">
            <Text fontSize={18} fontWeight="bold">
              Switch Store
            </Text>

            {
              stores.map((store) => (
                <TouchableOpacity key={store.value} onPress={() => handleSelectStore(store.value)}>
                  <Text>{store?.label}</Text>
                </TouchableOpacity>
              ))
            }
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}

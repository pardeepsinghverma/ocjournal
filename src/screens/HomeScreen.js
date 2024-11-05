// src/screens/HomeScreen.js
import React from 'react';
import { Text } from 'react-native';
import { Button, View } from 'tamagui';
import LayoutRenderer from '../modules/layoutRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '../store/dataSlice';
import { NavigationContainer } from '@react-navigation/native';
import { ProductCard } from '../components/products/card';
import MoreScreen from './MoreScreen';
import ProfileScreen from './ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  const { currentSubDomain, extra } = useSelector(state => state.data);
  const dispatch = useDispatch();
  const clickHanddler = () => {
    dispatch(setData({ name: "extra", data: "anmol111" }));
    console.log(extra);
  }
  // const [layoutData, setLayoutData] = useState(null);

  // useEffect(() => {
  //   const fetchLayout = async () => {
  //     try {
  //       const response = await fetch('https://your-api.com/layout');
  //       const data = await response.json();
  //       setLayoutData(data);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchLayout();
  // }, []);

  return (
    <View style={{ flex: 1 }}>
      {/* {layoutData ? <LayoutRenderer layoutData={layoutData} /> : <ActivityIndicator size="large" />} */}
      <Button title="Click me" color={'#000000'} variant='outlined' onPress={clickHanddler} />
      <LayoutRenderer />
        <Stack.Navigator initialRouteName="Profile">
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Details" component={MoreScreen} />
        </Stack.Navigator>
    </View>
  );
}

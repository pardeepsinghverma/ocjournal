// src/screens/HomeScreen.js
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Button, View } from 'tamagui';
import LayoutRenderer from '../../modules/layoutRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '../../store/dataSlice';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ProductCard } from '../../components/products/card';
import Category from '../../modules/category';
import MoreScreen from '../MoreScreen';
import ProfileScreen from '../ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  const { currentSubDomain, extra } = useSelector(state => state.data);
  const dispatch = useDispatch();
  const clickHanddler = () => {
    // dispatch(setData({ name: "subDomain", data: "anmol111" }));
    console.log(currentSubDomain);
  }
  const navigation = useNavigation();
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
    <ScrollView >

      <View style={{ flex: 1 }} paddingHorizontal={14}>
        {/* <Stack.Navigator initialRouteName="Profile"
          screenOptions={{
            headerShown: true,
            headerRight: () => 
              <View marginEnd={10} flex={1} flexDirection='row' gap={10} alignItems='center'>
                <TouchableOpacity><Text>Search1</Text></TouchableOpacity>
                <TouchableOpacity><Text>Heart</Text></TouchableOpacity>
                <TouchableOpacity><Text>Cart</Text></TouchableOpacity>
              </View>,
          }}>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Details" component={MoreScreen} />
          </Stack.Navigator> */}
        {/* {layoutData ? <LayoutRenderer layoutData={layoutData} /> : <ActivityIndicator size="large" />} */}
        {/* <Text>{currentSubDomain}</Text>
        <Button title="Click me" color={'#000000'} variant='outlined' onPress={()=>{clickHanddler()}}>Show SubDomain</Button> */}
        <LayoutRenderer />
        {/* <Button title="Go to Details" onPress={() => navigation.navigate('category')}>click</Button> */}
      </View>
    </ScrollView>
  );
}

// src/screens/HomeScreen.js
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Button, Image, View } from 'tamagui';
import LayoutRenderer from '../../modules/layoutRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '../../store/dataSlice';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { ProductCard } from '../../components/products/card';
import Category from '../../modules/category';
import MoreScreen from '../MoreScreen';
import ProfileScreen from '../ProfileScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RefreshControl, ScrollView } from 'react-native-gesture-handler';
import apiRequest from '../../api/apiclient';
import componentMap from '../../modules';
import layoutData from './../../data/layout1.json'

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  const { currentSubDomain, extra } = useSelector(state => state.data);
  const dispatch = useDispatch();
  const clickHanddler = () => {
    // dispatch(setData({ name: "subDomain", data: "anmol111" }));
    console.log(currentSubDomain);
  }
  const [contentTop, setContentTop] = useState(layoutData.column_top.modules[0].rows);
  const [header, setHeader] = useState(layoutData.header);

  console.log(header.logo);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Perform your data fetching or refresh logic here
    setTimeout(() => {
      setRefreshing(false);
    }, 2000); // Simulate a 2-second refresh

  };

  const navigation = useNavigation();
  // const [layoutData, setLayoutData] = useState(null);

  const fetchLayout = async () => {
    try {
      // console.log('fetching layout data ----------------------');
      // const response = await fetch('https://dev301.fathershops-test.xyz/?mp=1');
      // const json = await response.json();

      // setContentTop(json.column_top.modules[0].rows);

      // console.log(json);
      // const data = await response.json();
      // setLayoutData(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // console.log(contentTop);
  }, [contentTop]);
  
  useEffect(() => {
    // fetchLayout();
    // console.log(layoutData)
  }, []);

  // const ModuleComponent = componentMap['categories'];
  // // console.log(ModuleComponent);
  // return ModuleComponent ? (

  //   <ModuleComponent key={1} data={[]} />
  // ) : null;


  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={fetchLayout}
        />
      }
    >

      <View style={{ flex: 1 }} paddingHorizontal={14}>

        {
          contentTop &&
          Object.keys(contentTop).map((key) => {
            const row = contentTop[key];
            const columns = row.columns;

            return Object.keys(columns).map((columnKey) => {
              const items = columns[columnKey].items;

              return Object.keys(items).map((itemKey) => {
                const item = items[itemKey];
                const mType = item.item.module_type;                
                const ModuleComponent = componentMap[mType];
                
                return ModuleComponent ? (
                  <ModuleComponent
                    key={item.item.module_id}
                    data={item.item.options.items}
                  />
                ) : null;
              });
            });
          })
        }

      </View>
      
    </ScrollView>
  );
}

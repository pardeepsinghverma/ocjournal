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
import layoutData from './../../data/home.json'
import Slider from '../../components/Slider/Slider';

const Stack = createNativeStackNavigator();

export default function HomeScreen() {
  const { currentSubDomain, extra } = useSelector(state => state.data);
  const dispatch = useDispatch();
  const clickHanddler = () => {
    // dispatch(setData({ name: "subDomain", data: "anmol111" }));
    // console.log(currentSubDomain);
  }
  const [contentTop, setContentTop] = useState(layoutData._storefront.layout.top.rows);
  const [contentBottom, setContentBottom] = useState(layoutData._storefront.layout.bottom.rows);
  const [header, setHeader] = useState(null); // home.json lacks a direct header object

  // console.log(header?.logo);
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

      // setContentTop(json._storefront.layout.top.rows);
      // setContentBottom(json._storefront.layout.bottom.rows);

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

  const renderSection = (sectionRows) => {
    if (!sectionRows) return null;
    
    return Object.keys(sectionRows).map((key) => {
      const row = sectionRows[key];
      const columns = row.columns;

      return Object.keys(columns).map((columnKey) => {
        const items = columns[columnKey].items;

        return Object.keys(items).map((itemKey) => {
          const item = items[itemKey];
          // Use item.item.type and item.item.data for home.json
          const mType = item.item.type;                
          const mId = item.item.id;                
          const ModuleComponent = componentMap[mType];
          
          return ModuleComponent ? (
            <View marginTop={10}>
              
              <ModuleComponent
                key={mId}
                data={item.item.data.items || []}
                options={item.item.data}
              />
            </View>
          ) : null;
        });
      });
    });
  };

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

        {/* <Slider /> */}

        {renderSection(contentTop)}
        {renderSection(contentBottom)}

      </View>
      
    </ScrollView>
  );
}

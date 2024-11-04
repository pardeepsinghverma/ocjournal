// src/screens/HomeScreen.js
import React from 'react';
import { Text } from 'react-native';
import { Button, View } from 'tamagui';
import LayoutRenderer from '../modules/layoutRenderer';
import { useDispatch, useSelector } from 'react-redux';
import { setData } from '../store/dataSlice';

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

  console.log(currentSubDomain);
  return (
    <View style={{ flex: 1 }}>
      {/* {layoutData ? <LayoutRenderer layoutData={layoutData} /> : <ActivityIndicator size="large" />} */}
      <Button title="Click me" color={'#000000'} variant='outlined' onPress={clickHanddler} />
      <LayoutRenderer />
    </View>
  );
}

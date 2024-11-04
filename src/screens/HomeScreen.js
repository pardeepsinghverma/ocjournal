// src/screens/HomeScreen.js
import React from 'react';
import { Text } from 'react-native';
import { View } from 'tamagui';
import LayoutRenderer from '../modules/layoutRenderer';

export default function HomeScreen() {
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
      <LayoutRenderer />
    </View>
  );
}

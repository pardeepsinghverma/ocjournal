import { Provider } from 'react-redux';
import store from './store/store';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './navigation/DrawerNavigator';
import StackNavigator from './navigation/stackNavigator';
import CatalogScreen from './screens/CatalogScreen';
import linking from './navigation/linkingConfig';
import handleDeepLinkSetup from './linking/handlers';
import ProductView from './screens/ProductView';

function AppContainer() {
  const subDomainRedux = useSelector(state => state.data.subDomain);
  const dispatch = useDispatch();
  const Stack = createNativeStackNavigator();

  useEffect(() => {
    // Set up the deep link listener
    const cleanUpListener = handleDeepLinkSetup(dispatch);

    // Clean up the listener when the component unmounts
    return () => {
      if (cleanUpListener) {
        cleanUpListener();
      }
    };
  }, [dispatch]);

  console.log('AppContainer render', subDomainRedux);

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="productView">
        <Stack.Screen name="main" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="child" component={StackNavigator} />
        <Stack.Screen name="category" component={CatalogScreen} />
        <Stack.Screen name="productView" component={ProductView} options={{
          headerStyle: {
            // backgroundColor: 'transparent', // Set background to transparent
            // elevation: 0,                   // Remove Android shadow
            // shadowOpacity: 0,               // Remove iOS shadow
          },
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
}

export default App;

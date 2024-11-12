import { Provider } from 'react-redux';
import store from './store/store';
import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './navigation/DrawerNavigator';
import StackNavigator from './navigation/stackNavigator';
import CatalogScreen from './Tabs/Catalog/CatalogScreen';
import linking from './navigation/linkingConfig';
import handleDeepLinkSetup from './linking/handlers';
import ProductView from './screens/ProductView';
import CheckoutNavigation from './screens/checkout/CheckoutNavigation';
import ProfileNavigation from './screens/profile/ProfileNavigation';
import MyOrders from './screens/profile/MyOrders';
import MyAddresses from './screens/profile/MyAddresses';
import MyProfile from './screens/profile/MyProfile';
import Login from './screens/auth/Login';

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
      <Stack.Navigator initialRouteName="main">
        <Stack.Screen name="main" component={DrawerNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="catalog" component={CatalogScreen} />
        <Stack.Screen name="productView" component={ProductView} options={{}} />
        <Stack.Screen name="checkoutNavigation" component={CheckoutNavigation} options={{ headerShown: false }} />
        <Stack.Screen name="myorders" component={MyOrders} />
        <Stack.Screen name="myaddresses" component={MyAddresses} />
        <Stack.Screen name="myprofile" component={MyProfile} />
        <Stack.Screen name="login" component={Login} />
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

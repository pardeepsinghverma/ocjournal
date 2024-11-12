import { View, Text } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cart from './Cart';
import Address from './Address';
import Payment from './Payment';

const CheckoutNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Cart">
            <Stack.Screen name="cart" component={Cart} />
            <Stack.Screen name="address" component={Address} />
            <Stack.Screen name='payment' component={Payment} />
        </Stack.Navigator>
    )
}

export default CheckoutNavigation
import React from 'react'
import Profile from './Profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyOrders from './MyOrders';
import MyAddresses from './MyAddresses';
import MyProfile from './MyProfile';

const ProfileNavigation = () => {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator initialRouteName="Profile">
            <Stack.Screen name="profile" component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name="myorders" component={MyOrders} />
            <Stack.Screen name="myaddresses" component={MyAddresses} />
            <Stack.Screen name="myprofile" component={MyProfile} />
        </Stack.Navigator>
    )
}

export default ProfileNavigation
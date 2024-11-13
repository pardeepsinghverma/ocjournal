import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Button } from 'tamagui';

const Cart = () => {
    const navigation = useNavigation();
    return (
        <View>
            <Text>cart</Text>
            <Button width={200} marginTop={5} onPress={()=>{navigation.navigate('address')}}>Go to Address</Button>
        </View>
    )
}

export default Cart
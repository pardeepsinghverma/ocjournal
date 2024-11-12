import { View, Text } from 'react-native'
import React from 'react'
import { Button } from 'tamagui'
import { useNavigation } from '@react-navigation/native';

const Address = () => {
  const navigation = useNavigation();
  return (
    <View>
      <Text>address</Text>
      <Button width={200} marginTop={5} onPress={()=>{navigation.navigate('payment')}}>Pay Now</Button>
    </View>
  )
}

export default Address
// src/screens/HomeScreen.js
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Button } from 'react-native';
import { View, Text } from 'tamagui';

export default function ProfileScreen() {
  const navigation = useNavigation();
  return (
    <View>
      <Text>ProfileScreen Screen</Text>
      <Button title="Go to Details" onPress={() => navigation.navigate('Details')} />
    </View>
  );
}

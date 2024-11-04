// src/components/Header.js
import React from 'react';
import { View, Text } from 'tamagui';
import { TouchableOpacity } from 'react-native';

export default function Header({ navigation }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 16 }}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Text>☰</Text> {/* Burger Menu */}
      </TouchableOpacity>
      
    </View>
  );
}

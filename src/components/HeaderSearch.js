import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import {
  Search
} from '@tamagui/lucide-icons';
export default function SearchHeader() {
  return (
    <View style={styles.container}>
      <Search size={20} color="#777" style={styles.icon} />
      <TextInput
        placeholder="Type here to search"
        style={styles.input}
        placeholderTextColor="#444444"
        color="#000000"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    color: '#000000',
    paddingHorizontal: 10,
    height: 40,
    width: '100%',
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
});
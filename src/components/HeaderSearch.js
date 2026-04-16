import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Search } from '@tamagui/lucide-icons';

export default function SearchHeader() {
  const navigation = useNavigation();
  const route = useRoute();
  const [query, setQuery] = useState(route?.params?.query ?? '');

  const handleSubmit = () => {
    const trimmed = query.trim();
    if (!trimmed) return;
    navigation.navigate('search', { query: trimmed });
  };

  return (
    <View style={styles.container}>
      <Search size={20} color="#777" style={styles.icon} />
      <TextInput
        placeholder="Type here to search"
        style={styles.input}
        placeholderTextColor="#444444"
        color="#000000"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSubmit}
        returnKeyType="search"
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

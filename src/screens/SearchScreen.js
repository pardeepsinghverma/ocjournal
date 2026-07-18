import React, { useState, useCallback, useRef } from 'react';
import {
  ActivityIndicator, ScrollView, TextInput,
  StyleSheet, TouchableOpacity,
} from 'react-native';
import { Image, Text, View, XStack, YStack } from 'tamagui';
import { useNavigation, useRoute } from '@react-navigation/native';
import MTitle from '../components/MTitle';
import ProductGrid from '../modules/productGrid';
import { searchProducts } from '../api/storefront';
import { colors } from '../utils/theme';

// ── Popular tags — shown on the discovery (empty query) screen ─────────────
const POPULAR_TAGS = [
  'T-Shirts', 'Joggers', 'Oversized', 'Anime', 'Bags',
  'Sliders', 'Vests', 'Printed', 'Buy 3 for 999', 'New & Popular',
];

// ── Discovery curations — shown when no query ──────────────────────────────
const CURATIONS = {
  featured: [
    { title: 'Shop Now', image: 'https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?w=400', action: 'shop' },
    { title: 'Live Now',  image: 'https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?w=400', action: 'live' },
  ],
  collections: [
    { title: 'New Arrivals', image: 'https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?w=400' },
    { title: 'Explore',      image: 'https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?w=400' },
    { title: 'Bewakoof Air', image: 'https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?w=400' },
    { title: 'Heavy Duty',   image: 'https://img.freepik.com/free-photo/closeup-scarlet-macaw-from-side-view-scarlet-macaw-closeup-head_488145-3540.jpg?w=400' },
  ],
};

// ── Sub-components ─────────────────────────────────────────────────────────
const PopularTags = ({ onTagPress }) => (
  <View marginBottom={4}>
    <MTitle title="Popular Searches" />
    <XStack flexWrap="wrap" gap="$2">
      {POPULAR_TAGS.map((tag) => (
        <TouchableOpacity key={tag} onPress={() => onTagPress(tag)} activeOpacity={0.7}>
          <View
            paddingHorizontal="$3" paddingVertical="$2"
            borderWidth={1} borderColor="$gray5" borderRadius="$6"
          >
            <Text fontSize={14}>{tag}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </XStack>
  </View>
);

const PopularCurations = () => (
  <View>
    <MTitle title="Popular Curations" />
    <XStack gap="$3" marginBottom="$3">
      {CURATIONS.featured.map((item) => (
        <View
          key={item.title} flex={1} borderWidth={1} borderColor="$gray5"
          borderRadius="$6" padding="$3" alignItems="center"
        >
          <Image source={{ uri: item.image }} width={100} height={100} borderRadius={16} marginBottom="$2" />
          <Text fontSize={14} fontWeight="600">{item.title}</Text>
        </View>
      ))}
    </XStack>
    <XStack flexWrap="wrap" gap="$3">
      {CURATIONS.collections.map((item) => (
        <View
          key={item.title} width="22.5%" borderWidth={1} borderColor="$gray5"
          borderRadius="$6" padding="$2" alignItems="center"
        >
          <Image source={{ uri: item.image }} width={60} height={60} borderRadius={12} marginBottom="$2" />
          <Text fontSize={12} textAlign="center">{item.title}</Text>
        </View>
      ))}
    </XStack>
  </View>
);

// ── Main screen ─────────────────────────────────────────────────────────────
const SearchScreen = () => {
  const route = useRoute();
  const [query, setQuery] = useState(route.params?.query ?? '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);

  const runSearch = useCallback(async (q) => {
    const term = q.trim();
    if (!term) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    const found = await searchProducts(term);
    setResults(found);
    setLoading(false);
  }, []);

  const handleTagPress = (tag) => {
    setQuery(tag);
    runSearch(tag);
  };

  const handleSubmit = () => runSearch(query);

  const showDiscovery = !searched;

  return (
    <View flex={1} backgroundColor="#fff">
      {/* ── Search input bar ── */}
      <XStack
        paddingHorizontal={12} paddingVertical={10}
        borderBottomWidth={1} borderBottomColor="#f0f0f0"
        gap={8} alignItems="center"
      >
        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder="Search products…"
          placeholderTextColor="#9ca3af"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
            <Text color="#888" fontSize={20} lineHeight={24}>✕</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={handleSubmit} style={styles.searchBtn}>
          <Text color="#fff" fontWeight="700" fontSize={13}>Search</Text>
        </TouchableOpacity>
      </XStack>

      <ScrollView style={{ flex: 1 }}>
        <YStack gap={14} padding={10}>

          {/* ── Loading ── */}
          {loading && (
            <View alignItems="center" paddingVertical={40}>
              <ActivityIndicator size="large" color={colors.brand} />
            </View>
          )}

          {/* ── Results ── */}
          {!loading && searched && results.length > 0 && (
            <View>
              <MTitle title={`Results for "${query}"`} />
              <ProductGrid products={results} title="" scroll={false} />
            </View>
          )}

          {/* ── No results ── */}
          {!loading && searched && results.length === 0 && (
            <View alignItems="center" paddingVertical={40}>
              <Text color="#888" fontSize={15}>No products found for "{query}"</Text>
              <Text color="#bbb" fontSize={13} marginTop={6}>Try a different keyword</Text>
            </View>
          )}

          {/* ── Discovery (empty state) ── */}
          {!loading && showDiscovery && (
            <>
              <PopularTags onTagPress={handleTagPress} />
              <PopularCurations />
            </>
          )}

        </YStack>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1, height: 40, borderWidth: 1, borderColor: '#e5e7eb',
    borderRadius: 8, paddingHorizontal: 12, fontSize: 15, color: '#1a1a1a',
    backgroundColor: '#f9fafb',
  },
  searchBtn: {
    backgroundColor: '#febf00', borderRadius: 8,
    paddingHorizontal: 14, paddingVertical: 9,
  },
});

export default SearchScreen;

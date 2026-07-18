// src/Tabs/Home/HomeScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { Text, View } from 'tamagui';
import { getHomeLayout } from '../../api/storefront';
import componentMap from '../../modules';

/**
 * Home screen — fully data-driven.
 *
 * The layout is fetched LIVE from the `common/home` Storefront route via
 * src/api/storefront.js#getHomeLayout (no local fixture). The backend origin is
 * configured in ONE place — `API_DOMAIN` in src/api/const.ts — so swapping to a
 * live domain later is a single-line change, nothing here needs to move.
 */
export default function HomeScreen() {
  const [contentTop, setContentTop] = useState({});
  const [contentBottom, setContentBottom] = useState({});
  const [loading, setLoading] = useState(true);   // first paint
  const [refreshing, setRefreshing] = useState(false); // pull-to-refresh
  const [error, setError] = useState(null);

  // Single source of truth for loading the layout — reused by the initial
  // effect and pull-to-refresh.
  const loadLayout = useCallback(async () => {
    const { top, bottom, error: err } = await getHomeLayout();
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setContentTop(top);
    setContentBottom(bottom);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      await loadLayout();
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [loadLayout]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadLayout();
    setRefreshing(false);
  }, [loadLayout]);

  const renderSection = (sectionRows) => {
    if (!sectionRows) return null;

    return Object.keys(sectionRows).map((key) => {
      const row = sectionRows[key];
      const rowScheme = row.color_scheme || null;
      const rowBackground = row.background || null;
      const isFullWidth = !!(row.classes && row.classes['fullwidth-row']);
      const columns = row.columns;

      return Object.keys(columns).map((columnKey) => {
        const items = columns[columnKey].items;

        return Object.keys(items).map((itemKey) => {
          const item = items[itemKey];
          const mType = item.item.type;
          const mId = item.item.id;
          const ModuleComponent = componentMap[mType];

          return ModuleComponent ? (
            <View key={mId} marginTop={10}>
              <ModuleComponent
                data={item.item.data.items || []}
                options={item.item.data}
                rowScheme={rowScheme}
                rowBackground={rowBackground}
                isFullWidth={isFullWidth}
              />
            </View>
          ) : null;
        });
      });
    });
  };

  // Initial blocking spinner (only before we ever have content).
  if (loading) {
    return (
      <View flex={1} alignItems="center" justifyContent="center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Hard failure with no content to show — offer a retry via pull-to-refresh.
  const hasContent =
    Object.keys(contentTop).length > 0 || Object.keys(contentBottom).length > 0;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{ flex: 1 }} paddingHorizontal={14}>
        {error && !hasContent ? (
          <View flex={1} alignItems="center" justifyContent="center" paddingVertical={80} gap={8}>
            <Text fontSize={15} color="#b00020" textAlign="center">
              Couldn’t load the home screen.
            </Text>
            <Text fontSize={12} color="#888888" textAlign="center">
              Pull down to retry.
            </Text>
          </View>
        ) : (
          <>
            {renderSection(contentTop)}
            {renderSection(contentBottom)}
          </>
        )}
      </View>
    </ScrollView>
  );
}

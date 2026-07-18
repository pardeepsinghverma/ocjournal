import React, { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BlogPostCard from './BlogPostCard';

// HomeScreen applies paddingHorizontal: 14 on both sides → 28 total.
const USABLE_WIDTH = Dimensions.get('window').width - 28;

/**
 * BlogPostsView
 *
 * Props:
 *   tabs        — array of { key, title, active, posts[] }
 *   settings    — {
 *                   columns   : number  — from itemsPerRow.sc[0].items (API: 1 on phone)
 *                   spacing   : number  — from itemsPerRow.sc[0].spacing (API: 20)
 *                   imageWidth  : number
 *                   imageHeight : number
 *                   hasTabs   : boolean
 *                 }
 *   onPressPost — (post) => void
 *
 * cardWidth  = (USABLE_WIDTH - spacing * (columns - 1)) / columns
 * The grid gap must match `spacing` exactly so the rendered gap is consistent
 * with the computed cardWidth.
 */
const BlogPostsView = ({ tabs, settings, onPressPost }) => {
  const { columns, spacing, imageWidth, imageHeight, hasTabs } = settings;

  // Determine the initially active tab from data (tab with active=true), or first.
  const initialIndex = tabs.findIndex((t) => t.active) >= 0
    ? tabs.findIndex((t) => t.active)
    : 0;
  const [activeIdx, setActiveIdx] = useState(initialIndex);

  if (!tabs || tabs.length === 0) return null;

  const activeTab = tabs[activeIdx] || tabs[0];
  const posts = activeTab ? activeTab.posts : [];

  // Card width: split usable width into `columns` slots with `spacing` gaps between them.
  // E.g. columns=1, spacing=20: cardWidth = usableWidth (one full-width card).
  const col = Math.max(1, columns);
  const cardWidth = (USABLE_WIDTH - spacing * (col - 1)) / col;
  const imgHeight = cardWidth * (imageHeight / (imageWidth || 1));

  return (
    <View style={styles.container}>
      {/* Tabs row — only when multiple tabs exist and hasTabs is true */}
      {hasTabs && tabs.length > 1 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab, idx) => {
            const isActive = idx === activeIdx;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.75}
                onPress={() => setActiveIdx(idx)}
                style={[styles.tab, isActive && styles.tabActive]}
              >
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* Post grid — gap matches `spacing` so the rendered gap is consistent
          with the cardWidth computed above. */}
      {posts.length === 0 ? null : (
        <View style={[styles.grid, { gap: spacing }]}>
          {posts.map((post) => (
            <BlogPostCard
              key={post.post_id}
              post={post}
              cardWidth={cardWidth}
              imageHeight={Math.round(imgHeight)}
              onPress={() => onPressPost && onPressPost(post)}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tabsScroll: {
    marginBottom: 14,
  },
  tabsContent: {
    gap: 8,
    paddingVertical: 2,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  tabActive: {
    backgroundColor: '#141414',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555555',
  },
  tabLabelActive: {
    color: '#ffffff',
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // gap is set inline from settings.spacing — do NOT add a static gap here.
  },
});

export default BlogPostsView;

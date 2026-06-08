import React from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Image, Paragraph, Text, YStack } from 'tamagui';
import { getPlaceholderImage } from '../utils/getImage';

/**
 * Layout module: `blog_posts` (latest articles carousel).
 *
 * Engine passes `data` = item.item.data.items (keyed object of tabs). Each tab
 * carries a `posts` keyed object of `{ post_id, thumb, author, name, date, description, href }`.
 * `options` = item.item.data.
 *
 * See docs/modules/blog_posts.md.
 */
const stripHtml = s => (typeof s === 'string' ? s.replace(/<[^>]+>/g, '').trim() : '');

const collectPosts = data => {
  const tabs = data ? (Array.isArray(data) ? data : Object.values(data)) : [];
  const out = [];
  for (const t of tabs) {
    if (t?.posts) out.push(...Object.values(t.posts));
  }
  return out;
};

const BlogPosts = ({ data, options }) => {
  const navigation = useNavigation();
  if (options?.status === false) return null;

  const posts = collectPosts(data);
  if (!posts.length) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 12, paddingVertical: 6, paddingHorizontal: 2 }}
    >
      {posts.map((p, i) => (
        <Card
          key={p.post_id ?? i}
          width={220}
          bordered
          borderRadius="$4"
          overflow="hidden"
          backgroundColor="#ffffff"
        >
          <Image
            src={getPlaceholderImage(p.thumb, 220, 130, 'Article')}
            width={220}
            height={130}
            objectFit="cover"
          />
          <YStack padding={12} gap={4}>
            <Paragraph fontSize={14} fontWeight="600" numberOfLines={2} color="#141414">
              {p.name}
            </Paragraph>
            <Text fontSize={12} color="#888888">
              {stripHtml(p.author)}
              {p.author && p.date ? ' · ' : ''}
              {stripHtml(p.date)}
            </Text>
          </YStack>
        </Card>
      ))}
    </ScrollView>
  );
};

export default BlogPosts;

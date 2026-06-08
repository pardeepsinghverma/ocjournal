# Module: `blog_posts`

> **Status:** ✅ Rendered by the app — wired in `src/modules/BlogPosts.js`, registered in `componentMap`
> **Layout type string:** `blog_posts`  ·  **App component:** — (none)

## 1. What it is

A tabbed blog post gallery module that displays blog articles organized into multiple categories or sections. Users can switch between tabs to view different post collections, with support for grid layouts, image dimensions, and call-to-action buttons (read more / wishlist / compare).

## 2. Where it appears in the live home layout

| Position | Row | Col | Item | Module ID | Name |
|----------|-----|-----|------|-----------|------|
| bottom   | 3   | 1   | 1    | 998       | Blog Posts / Latest Articles / Tabs |

## 3. API `item.data` shape

| Field | Type | Purpose |
|-------|------|---------|
| **title** | string | Module title/heading |
| **display** | string | Layout mode (e.g., `"grid"`) |
| **sectionsDisplay** | string | How sections are displayed (`"tabs"` in this instance) |
| **items** | object | Tab definitions; keys are tab numbers (1, 2, etc.), each containing `title`, `tabType`, `filter`, `index`, `id`, `active` (boolean), and nested `posts`/`items` arrays with actual blog post data |
| **carousel** | boolean | Whether to use carousel mode (false in this instance) |
| **tabsStyle** | string | Tabs visual style (e.g., `"DEFAULT_LARGE"`) |
| **tabsStyleMenuImage** | string | Tab menu image style (e.g., `"DEFAULT"`) |
| **itemsPerRow** | object | Responsive grid columns (breakpoints: 0, 500, 900, 1200px; keys c0, c1, c2, sc) |
| **imageDimensions** | object | `width`, `height`, `resize` (fill/fit strategy) — defaults to 520×350px |
| **modulePostList** | string | Post list template (e.g., `"DEFAULT"`) |
| **modulePostListButtonDisplay** | string | Button display mode (e.g., `"both"` for read more + wishlist) |
| **modulePostListButtonButton** | string | Button style (e.g., `"LINK_UNDERLINE"`) |
| **gridType** | string | Grid layout type (e.g., `"auto"`) |
| **status** | boolean | Whether the module is active |
| **module_id** | number | Unique module instance ID |
| **classes** | object | CSS classes array (includes `module`, `module-blog_posts`, instance-specific class) |
| **schedule** | object | Publication schedule (`from`, `to`, `between` dates) |

The real blog post content lives in **`items[n].posts`** or **`items[n].items`** — arrays of post objects with title, image, description, category/filter, and action links.

## 4. How the app renders it

The `componentMap` in `src/modules/index.js` (line 12–20) has **no entry for `blog_posts`**, so the module is invisible to the app. When `HomeScreen.renderSection()` encounters a blog_posts module in the layout, it fails to find a matching component and renders nothing.

### How to add it

1. **Create the component file** at `src/modules/BlogPosts.js`:

```javascript
export default function BlogPosts({ data, options }) {
  const tabs = data?.items || {};
  const [activeTabId, setActiveTabId] = React.useState(options?.default_index || 1);
  
  const activeTab = tabs[activeTabId];
  const posts = activeTab?.posts || activeTab?.items || [];
  
  return (
    <View style={styles.container}>
      {/* Render tab buttons */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {Object.entries(tabs).map(([key, tab]) => (
          <TouchableOpacity
            key={key}
            onPress={() => setActiveTabId(parseInt(key))}
            style={[styles.tab, activeTabId === parseInt(key) && styles.tabActive]}
          >
            <Text style={styles.tabTitle}>{tab.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Render posts grid */}
      <FlatList
        data={posts}
        numColumns={options?.itemsPerRow?.c0?.[0] || 1}
        keyExtractor={(item, idx) => item.id || String(idx)}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <Image
              source={{ uri: item.image }}
              style={{
                width: options?.image_width || 520,
                height: options?.image_height || 350,
              }}
            />
            <Text style={styles.postTitle}>{item.title}</Text>
            {options?.modulePostListButtonDisplay !== 'none' && (
              <TouchableOpacity onPress={() => navigation.navigate('PostDetail', { id: item.id })}>
                <Text style={styles.readMoreButton}>Read More</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}
```

2. **Register in `src/modules/index.js`** (line 12–20):

```javascript
import BlogPosts from './BlogPosts';

const componentMap = {
  // ... existing entries
  blog_posts: BlogPosts,  // ADD THIS LINE
};
```

3. **Follow existing conventions:**
   - Read from `props.data` (the `item.data` object from the layout API)
   - Use `props.options` for styling/behavioral config (image dimensions, button text, etc.)
   - Render responsive grids using `itemsPerRow` breakpoints
   - Handle image fallbacks via `getPlaceholderImage()` (see `banner.js` or `Products.js` for examples)
   - Implement tab switching by tracking `activeTabId` state
   - Navigate to post detail pages via `navigation.navigate('PostDetail', { id: item.id })`

## 5. Gotchas & notes

- **Tabs are keyed by number** (1, 2, etc. as strings), not by ID — use `Object.entries()` to iterate and convert keys to integers when needed.
- **Posts live in nested arrays** — each tab has either a `posts` or `items` property containing the actual post objects; check both.
- **Responsive columns** — `itemsPerRow` uses breakpoint keys (0, 500, 900, 1200px) and category sub-keys (c0, c1, c2, sc); consult window width to select the correct column count.
- **Image dimensions** — `imageDimensions` may have `null` width/height (defaults to 520×350); the `image_resize` field controls scaling strategy (fill/fit).
- **Button text is pre-formatted** — `button_cart`, `button_wishlist`, `button_compare` are already translated strings; use them as-is.
- **Schedule support** — the `schedule` object contains publication date range; respect `schedule.between` to conditionally show/hide the module.
- **Carousel mode** — `carousel` and `swiper_carousel` flags indicate whether to render as a sliding carousel; this instance uses `carousel: false`, so render a static grid.
- **Default active tab** — use `options.default_index` (defaults to 1) to set the initially active tab.

import React from 'react';
import BlogPostsView from '../components/BlogPosts/BlogPostsView';

/**
 * BlogPosts module entry.
 *
 * HomeScreen calls:
 *   <BlogPosts data={item.item.data.items || []} options={item.item.data} />
 *
 * data   = the items/tabs keyed object {"1":{...},"2":{...}}
 *          (or [] when empty — guard for both shapes)
 * options = full data object (config + items)
 *
 * Data shape (per schema):
 *   options.status            boolean — render nothing when false
 *   options.sectionsDisplay   string  — "tabs" → show tab bar
 *   options.itemsPerRow       object  — responsive column config keyed by tier (c0/c1/c2/sc)
 *                                       each tier is an object keyed by breakpoint px ("0","500","900","1200")
 *                                       value: { items: number, spacing: number }
 *   options.image_width       number  — thumbnail width hint
 *   options.image_height      number  — thumbnail height hint
 *   options.default_index     number  — 1-based index of the initially active tab
 *
 *   Each tab (inside data / options.items):
 *     title   string — tab label
 *     active  boolean — initially selected
 *     index   number
 *     posts   keyed object {"3":{...},"4":{...},...}
 *
 *   Each post:
 *     post_id     string
 *     thumb       string (URL, may be localhost → placeholder)
 *     author      string
 *     name        string — title
 *     comments    string
 *     views       string
 *     date        string — may contain <em> HTML
 *     description string — excerpt (plain text in sample)
 *     href        string — web URL (no matching RN route → no-op tap)
 *
 * NOTE: There is no `blogPost` route in the RN navigation stack (App.js only
 * defines: main, catalog, productView, checkout screens, etc.). Post taps are
 * wired but no-op until a BlogPost screen is added.
 */

// Pick the best column count for a phone-width viewport.
// itemsPerRow is keyed by column tier (c0, c1, c2, sc); within each tier,
// keys are breakpoint strings like "0", "500", "900", "1200".
// We want the entry for the *largest* breakpoint that is <= the phone width.
// Phone widths are typically 320–430 px, so breakpoint "500" (items=1) applies.
const getColumnsForPhone = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 2;

  // Prefer the first responsive tier (c0), then c1, then c2, then sc.
  const tier = itemsPerRow.c0 || itemsPerRow.c1 || itemsPerRow.c2;
  if (!tier || typeof tier !== 'object') return 2;

  // Pick the largest breakpoint <= 430 (typical phone width).
  const PHONE_WIDTH = 430;
  const keys = Object.keys(tier)
    .map(Number)
    .filter((k) => !Number.isNaN(k))
    .sort((a, b) => a - b);

  let chosen = keys[0] !== undefined ? keys[0] : null;
  for (const k of keys) {
    if (k <= PHONE_WIDTH) chosen = k;
    else break;
  }

  const entry = chosen !== null ? tier[String(chosen)] : null;
  if (entry && typeof entry.items === 'number') {
    return Math.max(1, entry.items);
  }
  return 2;
};

const getSpacingForPhone = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 14;

  const tier = itemsPerRow.c0 || itemsPerRow.c1 || itemsPerRow.c2;
  if (!tier || typeof tier !== 'object') return 14;

  const PHONE_WIDTH = 430;
  const keys = Object.keys(tier)
    .map(Number)
    .filter((k) => !Number.isNaN(k))
    .sort((a, b) => a - b);

  let chosen = keys[0] !== undefined ? keys[0] : null;
  for (const k of keys) {
    if (k <= PHONE_WIDTH) chosen = k;
    else break;
  }

  const entry = chosen !== null ? tier[String(chosen)] : null;
  return entry && typeof entry.spacing === 'number' ? entry.spacing : 14;
};

// Normalize a keyed-object or array into an array, filtering out falsy entries.
const toArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  return Object.values(val).filter(Boolean);
};

// Map a raw tab object from the API to a clean view-model.
const parseTab = (rawTab) => ({
  key: rawTab.id || String(rawTab.index || Math.random()),
  title: rawTab.title || '',
  active: !!rawTab.active,
  index: rawTab.index || 0,
  posts: toArray(rawTab.posts).map((p) => ({
    post_id: p.post_id || String(Math.random()),
    thumb: p.thumb || null,
    author: p.author || '',
    name: p.name || '',
    comments: p.comments || '',
    views: p.views || '',
    date: p.date || '',
    description: p.description || '',
    href: p.href || '',
  })),
});

const BlogPosts = ({ data, options = {} }) => {
  // Respect the module's enabled flag.
  if (options.status === false) return null;

  // Normalize the tab list from the keyed object.
  const rawTabs = toArray(data);
  if (rawTabs.length === 0) return null;

  const tabs = rawTabs.map(parseTab);

  // Confirm at least one tab has posts.
  const hasPosts = tabs.some((t) => t.posts.length > 0);
  if (!hasPosts) return null;

  // Derive display settings from options — no hardcoded values.
  const columns = getColumnsForPhone(options.itemsPerRow);
  const spacing = getSpacingForPhone(options.itemsPerRow);
  const imageWidth = options.image_width || 520;
  const imageHeight = options.image_height || 350;

  // Show tabs when sectionsDisplay is "tabs" AND there is more than one tab.
  const hasTabs = options.sectionsDisplay === 'tabs' && tabs.length > 1;

  const settings = {
    columns,
    spacing,
    imageWidth,
    imageHeight,
    hasTabs,
  };

  // No-op handler: no `blogPost` route exists in the RN navigator.
  // Wire the press now so adding the route later only requires this one change.
  const handlePressPost = (_post) => {
    // TODO: navigate to BlogPost screen once route is added:
    // navigation.navigate('blogPost', { postId: post.post_id });
  };

  return (
    <BlogPostsView
      tabs={tabs}
      settings={settings}
      onPressPost={handlePressPost}
    />
  );
};

export default BlogPosts;

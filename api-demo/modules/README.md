# Home-layout module slices (`common/home`)

One folder per module `type` found in the live Storefront home response.
Each holds `sample.json` (a representative module item: `{id,name,type,data}`),
`schema.txt` (typed key tree + max depth), and `_all.json` when the page has
more than one instance of that type.

Layout path for every module:
`_storefront.layout.{top,bottom}.rows[r].columns[c].items[i].item`
(the renderer in `src/Tabs/Home/HomeScreen.js` passes `data.items` as `data`
and the whole `data` object as `options`).

| type | instances | data keys | items (kind × count) | max depth | representative |
|------|-----------|-----------|----------------------|-----------|----------------|
| `banners` | 2 | 19 | keyed-object × 2 | 6 | 798 "Simple Banners / Bento 9 / Left" |
| `blog_posts` | 1 | 38 | keyed-object × 2 | 7 | 998 "Blog Posts / Latest Articles / Tabs" |
| `categories` | 1 | 44 | keyed-object × 1 | 7 | 1101 "Categories / Large Card" |
| `countdown` | 1 | — (empty) | — | 1 | 801 "Simple Countdown Copy" |
| `gallery` | 1 | 42 | keyed-object × 18 | 6 | 838 "Gallery / Simple Carousel" |
| `grid` | 1 | 4 | — | 9 | 800 "Builder / Countdown + Products" |
| `info_blocks` | 1 | 15 | keyed-object × 4 | 6 | 781 "Info Blocks / Site Features" |
| `manufacturers` | 1 | 33 | keyed-object × 1 | 7 | 997 "Brands / Default" |
| `marquee` | 1 | 14 | keyed-object × 2 | 6 | 407 "Marquee / Free Shipping" |
| `products` | 2 | 75 | keyed-object × 1 | 6 | 867 "Products / Home / New Arrivals from Category" |
| `slider` | 1 | 58 | keyed-object × 3 | 8 | 871 "Slider / Default / Image Layer / Hotspots" |
| `testimonials` | 1 | 25 | keyed-object × 10 | 6 | 256 "Testimonials / Default" |
| `title` | 5 | 22 | array × 0 | 4 | 1099 "Title / Home / Featured Products Copy" |

## Two shape gotchas these slices document

1. **`data.items` is a KEYED OBJECT, not an array** (`{"1":{…},"2":{…}}`) for
   every type except `title` (whose `items` is a real, here empty, array). The
   HomeScreen renderer passes `data.items || []` straight through as the `data`
   prop, so each module normalises it itself — which is why the existing modules
   open with `Object.values(data)` (InfoBlocks, MasterSlider) or the defensive
   `Array.isArray(data) ? data : Object.values(data)` (Marquee, Gallery,
   Testimonials). A new module MUST do the same; `data.map(...)` would throw.
2. **`grid`-nested modules arrive with empty `data`** (`countdown`,
   the builder-nested `products`). The Journal3 backend does not attach their
   `data` payload in the storefront response, so they render empty until the
   backend is fixed.


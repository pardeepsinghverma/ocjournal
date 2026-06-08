/**
 * api-demo/generate.js
 * ---------------------------------------------------------------------------
 * Slices the live `common/home` Storefront response down to ONE representative
 * sample per home-layout module `type`, plus a typed schema tree (with max
 * depth) so we can see exactly what JSON shape — and to what depth — each
 * React-Native module in src/modules/ has to consume.
 *
 * Input  : api-demo/_raw/common-home.json   (the raw API response)
 * Output : api-demo/modules/<type>/sample.json   full module item (id,name,type,data)
 *          api-demo/modules/<type>/schema.txt     typed key tree + depth
 *          api-demo/modules/<type>/_all.json      every instance (only when >1)
 *          api-demo/modules/README.md             master index table
 *
 * Re-fetch the raw input with:
 *   curl -s -H "X-OC-Storefront-App: testkey" \
 *     "http://localhost:8080/index.php?route=common/home" \
 *     -o api-demo/_raw/common-home.json
 * then re-run:  node api-demo/generate.js
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const RAW = path.join(ROOT, '_raw', 'common-home.json');
const OUT = path.join(ROOT, 'modules');

const MAX_TREE_DEPTH = 8;       // safety cap for the printed schema tree
const STR_PREVIEW = 60;         // chars of a string value to show inline

// ---------- helpers ----------------------------------------------------------
const typeOf = v =>
  v === null ? 'null' : Array.isArray(v) ? 'array' : typeof v;

const preview = v => {
  if (typeof v === 'string') {
    const s = v.replace(/\s+/g, ' ').trim();
    return ' = ' + JSON.stringify(s.length > STR_PREVIEW ? s.slice(0, STR_PREVIEW) + '…' : s);
  }
  if (typeof v === 'number' || typeof v === 'boolean' || v === null) return ' = ' + String(v);
  return '';
};

// structural depth of a value (scalar = 0)
const depthOf = v => {
  if (Array.isArray(v)) return v.length ? 1 + Math.max(...v.map(depthOf)) : 1;
  if (v && typeof v === 'object') {
    const ks = Object.keys(v);
    return ks.length ? 1 + Math.max(...ks.map(k => depthOf(v[k]))) : 1;
  }
  return 0;
};

// typed, indented schema tree. Arrays collapse to length + element[0] shape.
const schemaLines = (v, name, depth, lines) => {
  const pad = '  '.repeat(depth);
  const t = typeOf(v);

  if (t === 'array') {
    lines.push(`${pad}${name}: array[${v.length}]`);
    if (depth >= MAX_TREE_DEPTH) { lines.push(`${pad}  …(depth cap)`); return; }
    if (v.length) schemaLines(v[0], '[0]', depth + 1, lines);
    return;
  }
  if (t === 'object') {
    const ks = Object.keys(v);
    lines.push(`${pad}${name}: object {${ks.length} keys}`);
    if (depth >= MAX_TREE_DEPTH) { lines.push(`${pad}  …(depth cap)`); return; }
    for (const k of ks) schemaLines(v[k], k, depth + 1, lines);
    return;
  }
  lines.push(`${pad}${name}: ${t}${preview(v)}`);
};

// ---------- walk the layout tree --------------------------------------------
// Modules live at: layout.{top,bottom}.rows[r].columns[c].items[i].item
// `grid` modules nest more rows/columns/items under item.data.rows.
const found = [];

const walkItems = (items, basePath) => {
  for (const ik of Object.keys(items || {})) {
    const it = items[ik] && items[ik].item;
    if (!it || !it.type) continue;
    const p = `${basePath}.items[${ik}]`;
    found.push({ type: it.type, item: it, path: p });

    const data = it.data || {};
    if (data.rows) {
      for (const rk of Object.keys(data.rows)) {
        const cols = (data.rows[rk] && data.rows[rk].columns) || {};
        for (const ck of Object.keys(cols)) {
          if (cols[ck].items) walkItems(cols[ck].items, `${p}.data.rows[${rk}].columns[${ck}]`);
        }
      }
    }
  }
};

const main = () => {
  const doc = JSON.parse(fs.readFileSync(RAW, 'utf8'));
  const layout = (doc._storefront && doc._storefront.layout) || {};

  for (const pos of ['top', 'bottom']) {
    const rows = (layout[pos] && layout[pos].rows) || {};
    for (const rk of Object.keys(rows)) {
      const cols = (rows[rk] && rows[rk].columns) || {};
      for (const ck of Object.keys(cols)) {
        if (cols[ck].items) walkItems(cols[ck].items, `${pos}.rows[${rk}].columns[${ck}]`);
      }
    }
  }

  // group by type
  const byType = {};
  for (const m of found) (byType[m.type] = byType[m.type] || []).push(m);

  // fresh output dir
  fs.rmSync(OUT, { recursive: true, force: true });
  fs.mkdirSync(OUT, { recursive: true });

  const indexRows = [];

  for (const type of Object.keys(byType).sort()) {
    const instances = byType[type];
    // representative = the instance whose `data` has the most keys (richest).
    const rep = instances
      .slice()
      .sort((a, b) => Object.keys(b.item.data || {}).length - Object.keys(a.item.data || {}).length)[0];

    const dir = path.join(OUT, type);
    fs.mkdirSync(dir, { recursive: true });

    // sample.json — the representative module item (id, name, type, data)
    fs.writeFileSync(path.join(dir, 'sample.json'), JSON.stringify(rep.item, null, 2));

    // schema.txt — typed tree + summary
    const dataKeys = Object.keys(rep.item.data || {});
    const itemsVal = (rep.item.data && rep.item.data.items) || null;
    // `items` is almost always a KEYED OBJECT ({"1":{…},"2":{…}}), not a JS
    // array. RN modules must iterate it with Object.values(...).map, NOT .map.
    const itemsKind = Array.isArray(itemsVal) ? 'array'
      : itemsVal && typeof itemsVal === 'object' ? 'keyed-object'
      : 'none';
    const itemsCount = itemsKind === 'array' ? itemsVal.length
      : itemsKind === 'keyed-object' ? Object.keys(itemsVal).length : 0;
    const maxDepth = depthOf(rep.item);
    const lines = [];
    lines.push(`MODULE TYPE: ${type}`);
    lines.push(`representative: id=${rep.item.id}  "${rep.item.name}"`);
    lines.push(`instances on this page: ${instances.length}` +
      (instances.length > 1 ? '  (see _all.json)' : ''));
    lines.push(`layout path: ${rep.path}`);
    lines.push(`data keys: ${dataKeys.length}`);
    lines.push(`data.items: ${itemsKind}${itemsKind !== 'none' ? `[${itemsCount}]` : ''}` +
      (itemsKind === 'keyed-object'
        ? '   <-- iterate with Object.values(items).map(), NOT items.map()'
        : ''));
    lines.push(`max structural depth (of full item): ${maxDepth}`);
    lines.push('');
    lines.push('SCHEMA TREE (item):');
    lines.push('-------------------');
    schemaLines(rep.item, 'item', 0, lines);
    fs.writeFileSync(path.join(dir, 'schema.txt'), lines.join('\n') + '\n');

    // _all.json — every instance when there is more than one
    if (instances.length > 1) {
      fs.writeFileSync(
        path.join(dir, '_all.json'),
        JSON.stringify(instances.map(i => ({ path: i.path, item: i.item })), null, 2),
      );
    }

    indexRows.push({
      type,
      count: instances.length,
      dataKeys: dataKeys.length,
      items: itemsCount,
      itemsKind,
      depth: maxDepth,
      hasData: dataKeys.length > 0,
      repId: rep.item.id,
      repName: rep.item.name,
    });
  }

  // README.md master index
  const md = [];
  md.push('# Home-layout module slices (`common/home`)');
  md.push('');
  md.push('One folder per module `type` found in the live Storefront home response.');
  md.push('Each holds `sample.json` (a representative module item: `{id,name,type,data}`),');
  md.push('`schema.txt` (typed key tree + max depth), and `_all.json` when the page has');
  md.push('more than one instance of that type.');
  md.push('');
  md.push('Layout path for every module:');
  md.push('`_storefront.layout.{top,bottom}.rows[r].columns[c].items[i].item`');
  md.push('(the renderer in `src/Tabs/Home/HomeScreen.js` passes `data.items` as `data`');
  md.push('and the whole `data` object as `options`).');
  md.push('');
  md.push('| type | instances | data keys | items (kind × count) | max depth | representative |');
  md.push('|------|-----------|-----------|----------------------|-----------|----------------|');
  for (const r of indexRows.sort((a, b) => a.type.localeCompare(b.type))) {
    const items = r.itemsKind === 'none' ? '—' : `${r.itemsKind} × ${r.items}`;
    md.push(`| \`${r.type}\` | ${r.count} | ${r.hasData ? r.dataKeys : '— (empty)'} | ${items} | ${r.depth} | ${r.repId} "${r.repName}" |`);
  }
  md.push('');
  md.push('## Two shape gotchas these slices document');
  md.push('');
  md.push('1. **`data.items` is a KEYED OBJECT, not an array** (`{"1":{…},"2":{…}}`) for');
  md.push('   every type except `title` (whose `items` is a real, here empty, array). The');
  md.push('   HomeScreen renderer passes `data.items || []` straight through as the `data`');
  md.push('   prop, so each module normalises it itself — which is why the existing modules');
  md.push('   open with `Object.values(data)` (InfoBlocks, MasterSlider) or the defensive');
  md.push('   `Array.isArray(data) ? data : Object.values(data)` (Marquee, Gallery,');
  md.push('   Testimonials). A new module MUST do the same; `data.map(...)` would throw.');
  md.push('2. **`grid`-nested modules arrive with empty `data`** (`countdown`,');
  md.push('   the builder-nested `products`). The Journal3 backend does not attach their');
  md.push('   `data` payload in the storefront response, so they render empty until the');
  md.push('   backend is fixed.');
  md.push('');
  fs.writeFileSync(path.join(OUT, 'README.md'), md.join('\n') + '\n');

  // console summary
  console.log(`Wrote ${indexRows.length} module types -> ${path.relative(process.cwd(), OUT)}`);
  for (const r of indexRows) {
    console.log(`  ${r.type.padEnd(14)} x${r.count}  dataKeys=${String(r.hasData ? r.dataKeys : 0).padStart(2)}  items=${(r.itemsKind === 'none' ? '—' : r.itemsKind + '×' + r.items).padEnd(15)}  depth=${r.depth}`);
  }
};

main();

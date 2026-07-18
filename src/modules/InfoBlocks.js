import React from 'react';
import InfoBlocksView from '../components/InfoBlocks/InfoBlocksView';

/**
 * InfoBlocks module entry (Journal3 "Site Features / Feature Icons" block).
 *
 * HomeScreen calls: <InfoBlocks data={item.item.data.items || []} options={item.item.data} />
 *   data    = keyed-object {"1":{…},"2":{…}} (NOT an array)
 *   options = the full data config object
 *
 * itemsPerRow config (from API):
 *   options.itemsPerRow.sc = [{ items: 1, spacing: 0 }]  ← phone breakpoint
 *   sc is always the array form per Journal3 spec.
 *
 * On phone, sc[0].items = 1 → single full-width column of feature rows.
 * InfoBlocksView renders a vertical stack which matches this layout exactly.
 * The derived `columns` value is passed as a prop so the view can adapt if
 * the API ever returns items > 1 on sc (e.g. for a two-column icon grid).
 */

/**
 * Read the column count for the phone (sc) breakpoint from itemsPerRow.
 * sc is always array form: [{ items: N, spacing: X }].
 * API value for info_blocks: sc[0].items = 1.
 * Hard fallback: 1.
 */
const scColumns = (itemsPerRow) => {
  if (!itemsPerRow || typeof itemsPerRow !== 'object') return 1;
  const sc = itemsPerRow.sc;
  if (Array.isArray(sc) && sc.length > 0 && sc[0] && typeof sc[0].items === 'number') {
    return Math.max(1, sc[0].items);
  }
  return 1;
};

const InfoBlocks = ({ data, options = {} }) => {
  // Guard: respect the module-level status flag.
  if (options.status === false) {
    return null;
  }

  // Normalise the keyed-object into an array — the #1 crash source.
  const rawList = Array.isArray(data) ? data : Object.values(data || {});

  // Map each raw item to a clean view-model the presentational layer consumes.
  const items = rawList
    .filter(Boolean)
    .map((item) => ({
      id: item.id || String(item.index || ''),
      index: item.index || 0,
      title: item.title || '',
      content: item.content || '',
      counter: item.counter || '',
      type: item.type || 'icon',
      colorScheme: item.color_scheme || '',
      link: item.link || null,
      button: !!item.button,
      buttonTextNew: item.buttonTextNew || '',
      buttonLink: item.buttonLink || null,
    }));

  if (items.length === 0) {
    return null;
  }

  // Derive column count from sc breakpoint (API: 1 column on phone).
  const columns = scColumns(options.itemsPerRow);

  return (
    <InfoBlocksView
      items={items}
      columns={columns}
      moduleColorScheme={options.color_scheme || ''}
      moduleTitle={options.title || ''}
      moduleDescription={options.description || ''}
    />
  );
};

export default InfoBlocks;

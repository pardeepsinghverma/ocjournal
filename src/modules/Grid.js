import React from 'react';
import { XStack, YStack } from 'tamagui';

/**
 * Layout module: `grid` (Journal3 "Builder").
 *
 * A grid is a RECURSIVE mini-layout: `options.rows` -> `columns` -> `items` ->
 * `item` (type/id/data) — the same shape as the top-level layout. This component
 * walks that tree and renders each nested module through the same `componentMap`.
 *
 * ⚠️ Backend limitation: the Storefront JSON API attaches `item.data` only to
 * TOP-LEVEL layout modules — nested grid children (e.g. countdown #801,
 * products #921) currently arrive WITHOUT `data`, so they render empty until the
 * backend's settings-attach loop (catalog/controller/event/storefront_api.php)
 * is extended to recurse into grid builders. The wiring below is correct and
 * will light up automatically once that data is present.
 *
 * See docs/modules/grid.md.
 */
const Grid = ({ options }) => {
  // Lazy require breaks the index.js <-> Grid.js import cycle (componentMap is
  // fully built by render time).
  const componentMap = require('./index').default;

  const rows = options?.rows;
  if (!rows) return null;

  const renderItems = items => {
    const list = items ? Object.values(items) : [];
    return list
      .map((wrap, i) => {
        const m = wrap?.item;
        if (!m) return null;
        const Comp = componentMap[m.type];
        if (!Comp) return null; // unmapped nested type -> skip
        return (
          <Comp
            key={m.id ?? i}
            data={(m.data && m.data.items) || []}
            options={m.data || {}}
          />
        );
      })
      .filter(Boolean);
  };

  return (
    <YStack gap={10}>
      {Object.values(rows).map((row, ri) => {
        const cols = Object.values(row?.columns || {});
        return (
          <XStack key={ri} gap={10} flexWrap="wrap">
            {cols.map((col, ci) => (
              <YStack key={ci} flex={1} minWidth={150}>
                {renderItems(col?.items)}
              </YStack>
            ))}
          </XStack>
        );
      })}
    </YStack>
  );
};

export default Grid;

import React from 'react';
import { XStack, YStack } from 'tamagui';

/**
 * Layout module: `grid` (Journal3 "Builder").
 *
 * A grid is a recursive mini-layout: `options.rows` -> `columns` -> `items` ->
 * `item` (type/id/data) — the same shape as the top-level layout. This component
 * walks that tree and renders each nested module through the same `componentMap`.
 *
 * Backend limitation: the Storefront JSON API attaches `item.data` only to
 * top-level layout modules. Nested grid children (e.g. countdown #801,
 * products #921) currently arrive WITHOUT `data`, so they render empty/null
 * until the backend's settings-attach loop is extended to recurse into grid
 * builders. The wiring below is correct and will light up automatically once
 * that data is present.
 *
 * Known empty-data children (as of 2026-06-09):
 *   - countdown (type not in componentMap -> skipped via Comp guard)
 *   - products nested inside grid (arrives with no data -> Products renders null)
 */
const Grid = ({ options }) => {
  // Lazy require breaks the index.js <-> Grid.js import cycle (componentMap is
  // fully built by render time).
  const componentMap = require('./index').default;

  if (!options) {
    return null;
  }

  // Respect module-level status flag (false means disabled by the tenant).
  if (options.status === false) {
    return null;
  }

  const rows = options.rows;
  if (!rows || typeof rows !== 'object') {
    return null;
  }

  const rowEntries = Object.entries(rows);
  if (rowEntries.length === 0) {
    return null;
  }

  const renderItems = (items) => {
    if (!items || typeof items !== 'object') {
      return [];
    }
    return Object.entries(items)
      .map(([itemKey, wrap]) => {
        const m = wrap && wrap.item;
        if (!m || !m.type) {
          return null;
        }
        // Unmapped types (e.g. countdown has no component) -> skip silently.
        const Comp = componentMap[m.type];
        if (!Comp) {
          return null;
        }
        // Child modules from backend arrive without `data`; guard both branches.
        const childData = (m.data && m.data.items) ? m.data.items : [];
        const childOptions = m.data || {};
        return (
          <Comp
            key={m.id != null ? m.id : itemKey}
            data={childData}
            options={childOptions}
          />
        );
      })
      .filter(Boolean);
  };

  const renderColumns = (columns) => {
    if (!columns || typeof columns !== 'object') {
      return null;
    }
    return Object.entries(columns).map(([colKey, col]) => {
      const renderedItems = renderItems(col && col.items);
      if (renderedItems.length === 0) {
        return null;
      }
      return (
        <YStack key={colKey} flex={1} minWidth={150}>
          {renderedItems}
        </YStack>
      );
    });
  };

  const renderedRows = rowEntries
    .map(([rowKey, row]) => {
      const cols = renderColumns(row && row.columns);
      // Filter out null columns; if all null, skip the row entirely.
      const activeCols = (cols || []).filter(Boolean);
      if (activeCols.length === 0) {
        return null;
      }
      return (
        <XStack key={rowKey} gap={10} flexWrap="wrap">
          {activeCols}
        </XStack>
      );
    })
    .filter(Boolean);

  // If every row resolved to empty, render nothing rather than an empty gap.
  if (renderedRows.length === 0) {
    return null;
  }

  return <YStack gap={10}>{renderedRows}</YStack>;
};

export default Grid;

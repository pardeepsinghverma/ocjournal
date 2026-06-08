import React from 'react';
import InfoBlocksView from '../components/InfoBlocks/InfoBlocksView';

// HomeScreen calls: <InfoBlocks data={item.item.data.items || []} options={item.item.data} />
//   data    = keyed-object {"1":{…},"2":{…}} (NOT an array)
//   options = the full data config object

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

  return (
    <InfoBlocksView
      items={items}
      moduleColorScheme={options.color_scheme || ''}
      moduleTitle={options.title || ''}
      moduleDescription={options.description || ''}
    />
  );
};

export default InfoBlocks;

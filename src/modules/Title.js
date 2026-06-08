import React from 'react';
import { getColorScheme } from '../components/common/colorSchemes';
import TitleView from '../components/Title/TitleView';

// Title module — Journal3 section-heading block.
//
// HomeScreen calls: <Title data={item.item.data.items || []} options={item.item.data} />
//   data    = items (always an empty array for this module type; guarded below)
//   options = full data object carrying all config fields

const Title = ({ data, options = {} }) => {
  // Guard: status false → render nothing
  if (!options || options.status === false) return null;

  // Normalize items — schema says array, but guard for keyed-object edge case
  // eslint-disable-next-line no-unused-vars
  const _items = Array.isArray(data) ? data : Object.values(data || {});

  // Resolve color scheme (may be absent — getColorScheme returns DEFAULT_SCHEME)
  const scheme = getColorScheme(options.color_scheme);

  // Derive view-model from options fields
  const viewProps = {
    title: options.title || '',
    subtitle: options.subtitle || '',
    label: options.label || '',
    inlineButtonText: options.inline_button_text || '',
    inlineButtonLink: options.inline_button_link || null,
    style: options.style || 'DEFAULT',
    alignment: options.alignment || null,
    classes: Array.isArray(options.classes) ? options.classes : [],
    scheme,
  };

  // If there's genuinely nothing to show, render nothing
  if (!viewProps.title && !viewProps.subtitle) return null;

  return <TitleView {...viewProps} />;
};

export default Title;

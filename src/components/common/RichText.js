import React from 'react';
import { Text } from 'react-native';

// Shared HTML-snippet renderer used by every home-screen module.
// Journal3 copy fields carry inline tags: <s>, <b>, <strong>, <sup>, <sub>, <br>.
// We parse them into styled <Text> segments — no HTML renderer needed.
// Recognised tags only; anything unknown is emitted as literal text.

const TAG_RE = /<\/?(s|sup|sub|b|strong|br)\s*\/?>/gi;

const STACK_KEY = {
  s: 'strike',
  b: 'bold',
  strong: 'bold',
  sup: 'sup',
  sub: 'sub',
};

const decodeEntities = (input) =>
  String(input)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/&#x?[0-9a-f]+;/gi, '');

export function parseHtmlSegments(html) {
  if (html == null || html === '') return [];
  const text = decodeEntities(html).replace(/\r/g, '');
  const segments = [];
  const stack = { strike: 0, bold: 0, sup: 0, sub: 0 };
  let lastIndex = 0;
  let match;

  const pushText = (chunk) => {
    if (!chunk) return;
    const parts = chunk.split('\n');
    parts.forEach((part, i) => {
      if (i > 0) segments.push({ br: true });
      if (part) {
        segments.push({
          text: part,
          strike: stack.strike > 0,
          bold: stack.bold > 0,
          sup: stack.sup > 0,
          sub: stack.sub > 0,
        });
      }
    });
  };

  TAG_RE.lastIndex = 0;
  while ((match = TAG_RE.exec(text)) !== null) {
    pushText(text.slice(lastIndex, match.index));
    const tag = match[1].toLowerCase();
    if (tag === 'br') {
      segments.push({ br: true });
    } else {
      const key = STACK_KEY[tag];
      if (match[0][1] === '/') stack[key] = Math.max(0, stack[key] - 1);
      else stack[key] += 1;
    }
    lastIndex = TAG_RE.lastIndex;
  }
  pushText(text.slice(lastIndex));
  return segments;
}

export function RichText({
  html,
  color = '#000',
  muted = color,
  fontSize = 14,
  fontWeight = '400',
  strikeSize = fontSize,
  supSize = Math.round(fontSize * 0.62),
  lineHeight,
  numberOfLines,
  style,
}) {
  const segments = parseHtmlSegments(html);
  if (!segments.length) return null;

  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ color, fontSize, fontWeight, lineHeight }, style]}
    >
      {segments.map((seg, i) => {
        if (seg.br) return '\n';
        const segStyle = {};
        if (seg.strike) {
          segStyle.textDecorationLine = 'line-through';
          segStyle.color = muted;
          segStyle.fontSize = strikeSize;
          segStyle.fontWeight = '400';
        }
        if (seg.bold) segStyle.fontWeight = '700';
        if (seg.sup || seg.sub) {
          segStyle.fontSize = supSize;
          segStyle.fontWeight = segStyle.fontWeight || '400';
        }
        return (
          <Text key={i} style={segStyle}>
            {seg.text}
          </Text>
        );
      })}
    </Text>
  );
}

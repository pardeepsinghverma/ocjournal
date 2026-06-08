import React from 'react';
import Svg, { Path } from 'react-native-svg';

const IoChevronBackOutline = ({ size = 24, color = '#000', strokeWidth = 48, ...rest }) => (
  <Svg width={size} height={size} viewBox="0 0 512 512" fill="none" {...rest}>
    <Path
      d="M328 112L184 256l144 144"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default IoChevronBackOutline;

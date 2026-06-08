import React from 'react';
import Svg, { Path } from 'react-native-svg';

const BsCart2 = ({ size = 24, color = '#000', strokeWidth = 0, ...rest }) => (
  <Svg width={size} height={size} viewBox="0 0 16 16" fill={color} {...rest}>
    <Path d="M0 2.5A.5.5 0 0 1 .5 2H2a.5.5 0 0 1 .485.379L2.89 4H14.5a.5.5 0 0 1 .485.621l-1.5 6A.5.5 0 0 1 13 11H4a.5.5 0 0 1-.485-.379L1.61 3H.5a.5.5 0 0 1-.5-.5zM3.14 5l1.25 5h8.22l1.25-5zM5 13a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2m9-3a2 2 0 1 0 0 4 2 2 0 0 0 0-4m0 3a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
  </Svg>
);

export default BsCart2;

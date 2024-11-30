import { Dimensions } from 'react-native';

/**
 * Function to calculate scaled dimensions based on the device's width, number of items per row, and spacing.
 *
 * @param {number} givenWidth - The original width.
 * @param {number} givenHeight - The original height.
 * @param {number} perRow - The number of items per row.
 * @param {number} [spacing=10] - The spacing between the items. Defaults to 10.
 * @returns {object} An object containing the scaled width and height.
 */
const calculateScaledDimensions = (givenWidth, givenHeight, perRow = 1, spacing = 10) => {
  // Get the device's width
  const { width: deviceWidth } = Dimensions.get('window');

  // Adjust spacing based on perRow
  const effectiveSpacing = perRow > 1 ? spacing * (perRow - 1) : 0;

  // Calculate the available width for items per row
  const availableWidth = deviceWidth - 28 - effectiveSpacing;

  // Calculate the scaled width per item
  const scaledWidth = availableWidth / perRow;

  // Calculate the aspect ratio (givenHeight / givenWidth)
  const aspectRatio = givenHeight / givenWidth;

  // Calculate the scaled height using the aspect ratio
  const scaledHeight = scaledWidth * aspectRatio;

  return {
    width: scaledWidth,
    height: scaledHeight,
  };
};

export default calculateScaledDimensions;

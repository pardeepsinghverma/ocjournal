/**
 * Returns the original image URL if valid, otherwise returns a placeholder URL.
 * 
 * @param {string|null} image - The original image URL.
 * @param {number} width - The desired width for the placeholder.
 * @param {number} height - The desired height for the placeholder.
 * @param {string} text - The text to display on the placeholder.
 * @returns {string} - The final image URL.
 */
export const getPlaceholderImage = (image, width = 400, height = 400, text = 'Image') => {
  // Filter out invalid primary sources (null, undefined, "null", "undefined")
  // if (
  //   image && 
  //   typeof image === 'string' && 
  //   image.trim() !== '' && 
  //   image.toLowerCase() !== 'null' && 
  //   image.toLowerCase() !== 'undefined' && 
  //   !image.includes('undefined')
  // ) {
  //   return image;
  // }
  
  const cleanWidth = Math.round(width) || 400;
  const cleanHeight = Math.round(height) || 400;
  const cleanText = encodeURIComponent(text);
  
  return `https://placehold.co/${cleanWidth}x${cleanHeight}/EEE/c3c3c3.png`;
};

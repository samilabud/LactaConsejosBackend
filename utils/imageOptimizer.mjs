import sharp from 'sharp';

/**
 * Optimizes a base64 image string.
 * Resizes if it's too wide and compresses quality.
 * @param {string} base64Str - The base64 image string (may include data:image/...)
 * @returns {Promise<string>} - The optimized base64 image string.
 */
export async function optimizeBase64Image(base64Str) {
  if (!base64Str || typeof base64Str !== 'string') return base64Str;

  // Basic check for base64 image
  const matches = base64Str.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
  
  if (!matches) {
    // If it doesn't match the data URI pattern, maybe it's raw base64?
    // Let's try to process it as is if it looks like base64, 
    // but for now let's be safe and return as is if no prefix.
    // Sharp can handle buffers, but we need to know what we have.
    return base64Str;
  }

  const imageType = matches[1];
  const base64Data = matches[2];
  const buffer = Buffer.from(base64Data, 'base64');

  try {
    let pipeline = sharp(buffer);

    // Get metadata to see if we should resize
    const metadata = await pipeline.metadata();

    // Max width 1200px
    if (metadata.width > 1200) {
      pipeline = pipeline.resize(1200);
    }

    // Convert to webp for better compression, or keep original type but compress
    // For simplicity and compatibility, we'll keep the original format but compress
    let compressedBuffer;
    if (imageType === 'jpeg' || imageType === 'jpg') {
      compressedBuffer = await pipeline.jpeg({ quality: 80 }).toBuffer();
    } else if (imageType === 'png') {
      compressedBuffer = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
    } else if (imageType === 'webp') {
      compressedBuffer = await pipeline.webp({ quality: 80 }).toBuffer();
    } else {
      // For other types, just resize if needed and convert to jpeg
      compressedBuffer = await pipeline.jpeg({ quality: 80 }).toBuffer();
      // Update prefix for next step
      return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
    }

    return `data:image/${imageType};base64,${compressedBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error optimizing image:', error);
    return base64Str; // Return original on error
  }
}

/**
 * Checks if a string is a base64 image.
 * @param {string} str 
 * @returns {boolean}
 */
export function isBase64Image(str) {
  if (!str || typeof str !== 'string') return false;
  return /^data:image\/([a-zA-Z+]+);base64,/.test(str);
}

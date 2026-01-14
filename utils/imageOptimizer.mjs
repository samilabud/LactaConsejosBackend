import sharp from 'sharp';

/**
 * Optimizes a base64 image string.
 * Resizes if it's too wide and compresses quality.
 * @param {string} base64Str - The base64 image string (may include data:image/...)
 * @returns {Promise<string>} - The optimized base64 image string.
 */
export async function optimizeBase64Image(base64Str) {
  if (!base64Str || typeof base64Str !== 'string') return base64Str;

  let imageType = null;
  let base64Data = null;
  let hasPrefix = false;

  // Check for data URI pattern
  const matches = base64Str.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
  
  if (matches) {
    imageType = matches[1];
    base64Data = matches[2];
    hasPrefix = true;
  } else {
    // Treat as raw base64
    base64Data = base64Str;
    hasPrefix = false;
  }

  const buffer = Buffer.from(base64Data, 'base64');

  try {
    let pipeline = sharp(buffer);

    // Get metadata to see if we should resize and to identify format if no prefix
    const metadata = await pipeline.metadata();
    
    if (!imageType) {
      imageType = metadata.format;
    }

    // Max width 1200px
    if (metadata.width > 1200) {
      pipeline = pipeline.resize(1200);
    }

    // Convert to webp for better compression, or keep original type but compress
    let compressedBuffer;
    if (imageType === 'jpeg' || imageType === 'jpg') {
      compressedBuffer = await pipeline.jpeg({ quality: 80 }).toBuffer();
    } else if (imageType === 'png') {
      // If it's a large PNG, converting to JPEG or WebP could save much more space
      // but let's stick to the original format unless it's specifically for web
      compressedBuffer = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
    } else if (imageType === 'webp') {
      compressedBuffer = await pipeline.webp({ quality: 80 }).toBuffer();
    } else {
      // Default to jpeg if unknown
      compressedBuffer = await pipeline.jpeg({ quality: 80 }).toBuffer();
      imageType = 'jpeg';
    }

    const optimizedBase64 = compressedBuffer.toString('base64');
    
    // Return in the same format (prefixed or raw) as it arrived
    if (hasPrefix) {
      return `data:image/${imageType};base64,${optimizedBase64}`;
    }
    return optimizedBase64;
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
  
  // Matches data URI prefix or common base64 image start signatures
  // /9j/ = jpeg, iVBORw = png, R0lGOD = gif, UklG = webp
  const isDataUri = /^data:image\/([a-zA-Z+]+);base64,/.test(str);
  const isRawBase64Image = /^(\/9j\/|iVBORw|R0lGOD|UklG)/.test(str);
  
  return isDataUri || isRawBase64Image;
}

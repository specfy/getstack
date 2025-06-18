import fs from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

/**
 *  npx tsx apps/backend/src/scripts/optimizeFavicons.ts
 */

const inputDir = path.resolve(import.meta.dirname, '../../../frontend/public/favicons');
const maxWidth = 200;
const quality = 100;

for (const file of fs.readdirSync(inputDir)) {
  if (!file.endsWith('-unop.webp')) {
    continue;
  }

  const inputPath = path.join(inputDir, file);
  const outputFileName = file.replace('-unop.webp', '.webp');
  const outputPath = path.join(inputDir, outputFileName);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (metadata.width > maxWidth) {
      await image.resize({ width: maxWidth }).webp({ quality }).toFile(outputPath);
    } else {
      await image.webp({ quality }).toFile(outputPath);
    }

    // Delete the original -unop.webp file after successful processing
    fs.unlinkSync(inputPath);

    console.log('Optimized:', file, '->', outputFileName);
  } catch (err) {
    console.error('Failed to process:', file, err);
  }
}

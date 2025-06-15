import fs from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

const inputDir = path.resolve(import.meta.dirname, '../../../frontend/public/favicons');
const outputDir = path.resolve(import.meta.dirname, '../../../frontend/public/favicons-optimized');
const maxWidth = 200;
const quality = 100;

fs.mkdirSync(outputDir, { recursive: true });

for (const file of fs.readdirSync(inputDir)) {
  if (!file.endsWith('.webp')) {
    continue;
  }

  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();

    if (metadata.width > maxWidth) {
      await image.resize({ width: maxWidth }).webp({ quality }).toFile(outputPath);
    } else {
      await image.webp({ quality }).toFile(outputPath);
    }

    console.log('Optimized:', file);
  } catch (err) {
    console.error('Failed to process:', file, err);
  }
}

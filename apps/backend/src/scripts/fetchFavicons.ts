import fs from 'node:fs/promises';
import path from 'node:path';

import { extendedListTech } from '../utils/stacks.js';

/**
 * LOGODEV_KEY=KEY npx tsx apps/backend/src/scripts/fetchFavicons.ts
 */
const fetchFavicons = async (): Promise<void> => {
  const outputDir = path.resolve(import.meta.dirname, '../../../frontend/public/favicons');

  // Ensure the output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  for (const tech of extendedListTech) {
    if (!tech.website) {
      continue;
    }

    try {
      const fileName = `${tech.key}.webp`;
      const fileNameUnOp = `${tech.key}-unop.webp`;
      const filePath = path.join(outputDir, fileName);
      const filePathUnOp = path.join(outputDir, fileNameUnOp);

      try {
        await fs.stat(filePath);
        continue;
      } catch {
        // not exists
      }
      const faviconUrl = new URL(
        `https://img.logo.dev/${new URL(tech.website).hostname}?token=${process.env['LOGODEV_KEY']}&size=64&retina=true&format=webp`
      );
      const response = await fetch(faviconUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error(`Failed to fetch favicon for ${tech.key}: HTTP ${response.status}`);
        continue;
      }

      await fs.writeFile(filePathUnOp, Buffer.from(await response.arrayBuffer()));
      console.log(`Favicon saved for ${tech.key} at ${filePathUnOp}`);
    } catch (err) {
      console.error(`Failed to fetch favicon for ${tech.key}:`, err);
    }
  }
};

await fetchFavicons();

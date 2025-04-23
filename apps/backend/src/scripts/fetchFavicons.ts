import fs from 'node:fs/promises';
import path from 'node:path';

import { extendedListTech } from '../utils/stacks';

const fetchFavicons = async () => {
  const outputDir = path.resolve(import.meta.dirname, '../../../frontend/public/favicons');

  // Ensure the output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  for (const tech of extendedListTech) {
    if (!tech.website) {
      continue;
    }

    try {
      const faviconUrl = new URL(
        `https://img.logo.dev/${new URL(tech.website).hostname}?token=pk_e8E7K3hvTQ-k3tccmMtKig&size=64&retina=true&format=webp`
      );
      const response = await fetch(faviconUrl, {
        method: 'GET',
      });

      if (!response.ok) {
        console.error(`Failed to fetch favicon for ${tech.key}: HTTP ${response.status}`);
        continue;
      }

      const fileName = `${tech.key}.webp`;
      const filePath = path.join(outputDir, fileName);

      await fs.writeFile(filePath, Buffer.from(await response.arrayBuffer()));
      console.log(`Favicon saved for ${tech.key} at ${filePath}`);
    } catch (err) {
      console.error(`Failed to fetch favicon for ${tech.key}:`, err);
    }
  }
};

await fetchFavicons();

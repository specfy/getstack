import { writeFile } from 'node:fs/promises';
import path from 'node:path';

import { extendedListTech } from '../utils/stacks.js';

const BASE_URL = 'https://getstack.dev';

async function generateSitemap(): Promise<void> {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  sitemap += `
  <url>
    <loc>${BASE_URL}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

  const categories = new Set<string>();
  for (const tech of extendedListTech) {
    categories.add(tech.type);
    sitemap += `
  <url>
    <loc>${BASE_URL}/tech/${tech.key}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  for (const category of categories) {
    sitemap += `
  <url>
    <loc>${BASE_URL}/category/${category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  sitemap += '\n</urlset>';

  // Write the sitemap to a file
  const outputPath = path.join(
    import.meta.dirname,
    '..',
    '..',
    '..',
    'frontend',
    'public',
    'sitemap.xml'
  );
  await writeFile(outputPath, sitemap, 'utf8');

  console.log(`Sitemap generated at: ${outputPath}`);
}

await generateSitemap();

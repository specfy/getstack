import { globSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { getAllLicensesNames } from '../models/licensesInfo.js';
import { extendedListTech } from '../utils/stacks.js';

const BASE_URL = 'https://getstack.dev';

/**
 * npx tsx --env-file=.env apps/backend/src/scripts/generateSitemap.ts
 */
async function generateSitemap(): Promise<void> {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const urls = [BASE_URL, `${BASE_URL}/blog`, `${BASE_URL}/about`, `${BASE_URL}/licenses`];
  for (const url of urls) {
    sitemap += `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;
  }

  const categories = new Set<string>();
  for (const category of categories) {
    sitemap += `
  <url>
    <loc>${BASE_URL}/category/${category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  const allPosts = globSync('apps/frontend/src/posts/**.mdx');
  for (const post of allPosts) {
    const tmp = await readFile(post);
    const content = tmp.toString();
    const match = content.match(/slug:\s*"([^"]+)"/);
    if (!match) {
      throw new Error(`Could not find slug in ${post}`);
    }

    const [, slug] = match;
    const idMatch = content.match(/id:\s*(\d+)/);
    if (!idMatch) {
      throw new Error(`Could not find id in ${post}`);
    }
    const [, id] = idMatch;
    sitemap += `
  <url>
    <loc>${BASE_URL}/blog/${slug}-${id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  for (const tech of extendedListTech) {
    categories.add(tech.type);
    sitemap += `
  <url>
    <loc>${BASE_URL}/tech/${tech.key}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  const licenses = await getAllLicensesNames();
  for (const license of licenses) {
    sitemap += `
  <url>
    <loc>${BASE_URL}/licenses/${license.key}</loc>
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

import { globSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { extendedListTech } from '../utils/stacks.js';

const BASE_URL = 'https://getstack.dev';

/**
 * npx tsx apps/backend/src/scripts/generateSitemap.ts
 */
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
  for (const category of categories) {
    sitemap += `
  <url>
    <loc>${BASE_URL}/category/${category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  }

  sitemap += `
  <url>
    <loc>${BASE_URL}/blog</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
  sitemap += `
  <url>
    <loc>${BASE_URL}/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
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

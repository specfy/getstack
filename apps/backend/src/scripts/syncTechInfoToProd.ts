#!/usr/bin/env node

/**
 * Read tech_info from local DB and PUT each to production API.
 *
 * Usage: npx tsx --env-file=../../.env apps/backend/src/scripts/syncTechInfoToProd.ts
 *
 * Requires in .env:
 *   DATABASE_URL       - local Postgres (source)
 *   ADMIN_SECRET       - same for local and prod
 *   PROD_API_URL       - prod API base URL (e.g. https://api.getstack.dev)
 */

import { db } from '../db/client.js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    console.error(`${name} is required`);
    process.exit(1);
  }
  return value;
}

const adminSecret = requireEnv('ADMIN_SECRET');
const prodApiUrl = requireEnv('PROD_API_URL');

const baseUrl = prodApiUrl.replace(/\/$/, '');
const basePath = '/1/technologies';

async function main() {
  const rows = await db
    .selectFrom('tech_info')
    .select(['key', 'long_description', 'website', 'github'])
    .execute();

  console.log(`Found ${rows.length} tech_info rows in local DB\n`);

  let ok = 0;
  let failed = 0;

  for (const row of rows) {
    const { key, long_description, website, github } = row;
    if (!key || !long_description) {
      console.error(`${key ?? '?'}: Skipped (missing key or long_description)`);
      failed++;
      continue;
    }

    const body = {
      longDescription: long_description,
      ...(website && { website }),
      ...(github && { github }),
    };

    const url = `${baseUrl}${basePath}/${key}/info`;

    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'X-Admin-Secret': adminSecret,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        console.log(`${key}: OK`);
        ok++;
      } else {
        const text = await res.text();
        console.error(`${key}: ${res.status} ${res.statusText} - ${text.slice(0, 100)}`);
        failed++;
      }
    } catch (err) {
      console.error(`${key}: ${err instanceof Error ? err.message : String(err)}`);
      failed++;
    }
  }

  console.log(`\nDone: ${ok} OK, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();

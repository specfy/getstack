#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * PUT one category_top row from a JSON file or from seed data (admin API).
 *
 * Usage:
 *   npx tsx --env-file=../../.env apps/backend/src/scripts/putCategoryTopFromJson.ts ./payload.json
 *
 * JSON (e.g. `apps/backend/src/data/category/iconset.json`):
 *   { "category": "iconset", "introduction": "...", "slugSegment": "iconsets" }
 *   Slug sent to the API is `${slugSegment}-${currentYear}` (see script body).
 *
 * Env:
 *   ADMIN_SECRET
 *   PROD_API_URL or API_BASE_URL — API origin (e.g. https://api.getstack.dev or http://127.0.0.1:3000)
 */

import { readFileSync } from 'node:fs';

import { z } from 'zod';

import { buildCategoryTopPublicSlug } from '../data/category/types.js';

const fileSchema = z.object({
  category: z.string().min(1),
  introduction: z.string().min(1),
  slugSegment: z.string().min(1),
});

function requireEnv(name: string): string {
  const value = process.env[name];
  if (value === undefined || value === '') {
    console.error(`${name} is required`);
    process.exit(1);
  }
  return value;
}

function resolveBaseUrl(): string {
  const raw = process.env['PROD_API_URL'] || process.env['API_BASE_URL'];
  if (raw === undefined || raw === '') {
    console.error('PROD_API_URL or API_BASE_URL is required');
    process.exit(1);
  }
  return raw.replace(/\/$/, '');
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const adminSecret = requireEnv('ADMIN_SECRET');
  const baseUrl = resolveBaseUrl();

  const jsonPath = args[0];
  if (jsonPath === undefined || jsonPath === '') {
    console.error('Usage: putCategoryTopFromJson.ts <path-to.json>');
    process.exit(1);
  }

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(jsonPath, 'utf8')) as unknown;
  } catch (err) {
    console.error(
      `Failed to read or parse JSON: ${err instanceof Error ? err.message : String(err)}`
    );
    process.exit(1);
  }

  const parsed = fileSchema.safeParse(raw);
  if (!parsed.success) {
    console.error(parsed.error.flatten());
    process.exit(1);
  }

  const row = parsed.data;
  const category = row.category;
  const url = `${baseUrl}/1/categories/${encodeURIComponent(category)}/trends`;
  const year = new Date().getFullYear();

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Admin-Secret': adminSecret,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ...row, slug: buildCategoryTopPublicSlug(row.slugSegment, year) }),
  });

  const text = await res.text();
  if (res.ok) {
    console.log(`${category}: OK`);
    process.exit(0);
  }

  console.error(`${category}: ${res.status} ${res.statusText} — ${text.slice(0, 500)}`);
  process.exit(1);
}

try {
  await main();
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

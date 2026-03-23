#!/usr/bin/env node

/**
 * PUT tech info to the API. Replaces the curl in the write-tech-info skill.
 *
 * Usage: node put-tech-info.js <json-file>
 *
 * JSON file format:
 * {
 *   "key": "rabbitmq",
 *   "longDescription": "Full markdown text...",
 *   "website": "https://www.rabbitmq.com/",
 *   "github": "rabbitmq/rabbitmq-server"
 * }
 *
 * Requires in .env: ADMIN_SECRET
 * Optional: API_URL (defaults to VITE_API_URL from apps/frontend/.env or http://localhost:3000)
 */

import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const projectRoot = resolve(__dirname, '../../..');

// Load .env from project root and frontend (for VITE_API_URL)
if (process.env.ADMIN_SECRET === undefined) {
  try {
    const dotenv = (await import('dotenv')).default;
    dotenv.config({ path: resolve(projectRoot, '.env') });
    dotenv.config({ path: resolve(projectRoot, 'apps/frontend/.env') });
  } catch {
    console.error('Run with: node --env-file=.env put-tech-info.js <json-file>');
    process.exit(1);
  }
}

const jsonPath = process.argv[2];
if (!jsonPath) {
  console.error('Usage: node put-tech-info.js <json-file>');
  process.exit(1);
}

const adminSecret = process.env.ADMIN_SECRET;
const apiUrl = process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:3000';

if (!adminSecret) {
  console.error('ADMIN_SECRET is required. Set it in .env or use --env-file=.env');
  process.exit(1);
}

let data;
try {
  const raw = await readFile(resolve(process.cwd(), jsonPath), 'utf-8');
  data = JSON.parse(raw);
} catch (error) {
  console.error('Failed to read/parse JSON:', error.message);
  process.exit(1);
}

const { key, longDescription, website, github } = data;
if (!key || !longDescription) {
  console.error('JSON must have "key" and "longDescription"');
  process.exit(1);
}

const body = { longDescription };
if (website) body.website = website;
if (github) body.github = github;

const url = `${apiUrl.replace(/\/$/, '')}/1/technologies/${key}/info`;

const res = await fetch(url, {
  method: 'PUT',
  headers: {
    'X-Admin-Secret': adminSecret,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
});

if (!res.ok) {
  console.error(`PUT failed: ${res.status} ${res.statusText}`, await res.text());
  process.exit(1);
}

console.log(`PUT ${key}: OK`);

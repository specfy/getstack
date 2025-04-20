import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { FileMigrationProvider } from 'kysely';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const migrationProvider = new FileMigrationProvider({
  fs,
  path,
  migrationFolder: path.join(__dirname, 'migrations'),
  migrationFileNamePattern: /^\d{16}_.+\.ts$/,
});

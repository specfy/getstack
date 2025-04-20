import { promises as fs } from 'node:fs';
import path from 'node:path';

import { FileMigrationProvider } from 'kysely';

export const migrationProvider = new FileMigrationProvider({
  fs,
  path,
  migrationFolder: path.join(import.meta.dirname, 'migrations'),
});

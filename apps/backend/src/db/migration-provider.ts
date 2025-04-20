import { FileMigrationProvider } from 'kysely'
import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const migrationProvider = new FileMigrationProvider({
  fs,
  path,
  migrationFolder: path.join(__dirname, 'migrations'),
  migrationFileNamePattern: /^\d{16}_.+\.ts$/,
}) 
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

import { upsertLicense } from '../models/licensesInfo.js';

import type { LicensesInfoInsert, LicensesInfoTableRow } from '../db/types.db.js';
import type { AllowedLicensesLowercase } from '../types/stack.js';

type LicenseFileData = { fullName: string } & Pick<
  LicensesInfoTableRow,
  'conditions' | 'description' | 'limitations' | 'permissions'
>;

const licensesDir = path.join(import.meta.dirname, 'licenses');
console.log(`Reading licenses from: ${licensesDir}`);

// Read all JSON files from the licenses directory
const files = await readdir(licensesDir);
const jsonFiles = files.filter((file) => file.endsWith('.json'));

console.log(`Found ${jsonFiles.length} license files`);

for (const file of jsonFiles) {
  try {
    const filePath = path.join(licensesDir, file);
    const fileContent = await readFile(filePath, 'utf8');
    const licenseData = JSON.parse(fileContent) as LicenseFileData;

    const key = file.replace('.json', '') as AllowedLicensesLowercase;

    const licenseToInsert: LicensesInfoInsert = {
      key,
      full_name: licenseData.fullName,
      description: licenseData.description,
      permissions: licenseData.permissions,
      conditions: licenseData.conditions,
      limitations: licenseData.limitations,
    };

    await upsertLicense(licenseToInsert);
    console.log(`✓ Processed license: ${key}`);
  } catch (err) {
    console.error(`✗ Error processing file ${file}:`, err);
  }
}

import { db } from '../db/client.js';

import type { LicensesInfoInsert, LicensesInfoTableRow } from '../db/types.db.js';
import type { AllowedLicensesLowercase } from '../types/stack.js';

export async function getLicense(
  key: AllowedLicensesLowercase
): Promise<LicensesInfoTableRow | null> {
  const row = await db
    .selectFrom('licenses_info')
    .selectAll()
    .where('key', '=', key)
    .limit(1)
    .executeTakeFirst();
  return row || null;
}

export async function upsertLicense(data: LicensesInfoInsert): Promise<void> {
  const tmp: LicensesInfoInsert = {
    ...data,
    limitations: JSON.stringify(data.limitations) as unknown as string[],
    permissions: JSON.stringify(data.permissions) as unknown as string[],
    conditions: JSON.stringify(data.conditions) as unknown as string[],
  };
  await db
    .insertInto('licenses_info')
    .values(tmp)
    .onConflict((oc) => oc.column('key').doUpdateSet(tmp))
    .executeTakeFirst();
}

export async function getAllLicensesNames(): Promise<{ key: string; full_name: string }[]> {
  return await db
    .selectFrom('licenses_info')
    .select(['key', 'full_name'])
    .orderBy('key', 'asc')
    .execute();
}

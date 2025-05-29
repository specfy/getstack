import { db } from '../db/client.js';

import type { LicensesInfoTableRow } from '../db/types.js';

export async function getLicense(key: string): Promise<LicensesInfoTableRow | null> {
  const row = await db
    .selectFrom('licenses_info')
    .selectAll()
    .where('key', '=', key)
    .limit(1)
    .executeTakeFirst();
  return row || null;
}

import { db } from '../db/client.js';
import { formatToDate } from '../utils/date.js';

import type { ProgressTableRow } from '../db/types.js';

export async function getOrInsert(dateWeek: string): Promise<ProgressTableRow> {
  const row = await db
    .selectFrom('progress')
    .selectAll()
    .where('date_week', '=', dateWeek)
    .executeTakeFirst();

  if (row) {
    return row;
  }

  const values = { date_week: dateWeek, progress: formatToDate(new Date()) };
  await db.insertInto('progress').values(values).execute();

  return values;
}

export async function update(dateWeek: string, progress: Date): Promise<void> {
  await db
    .updateTable('progress')
    .set({ progress: progress.toISOString() })
    .where('date_week', '=', dateWeek)
    .execute();
}

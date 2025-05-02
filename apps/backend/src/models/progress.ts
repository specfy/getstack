import { db } from '../db/client.js';
import { formatToDate } from '../utils/date.js';

import type { ProgressTableRow } from '../db/types.js';

export async function getOrInsert({
  date_week,
  type,
}: Pick<ProgressTableRow, 'date_week' | 'type'>): Promise<ProgressTableRow> {
  const row = await db
    .selectFrom('progress')
    .selectAll()
    .where('date_week', '=', date_week)
    .where('type', '=', type)
    .executeTakeFirst();

  if (row) {
    return row;
  }

  const res = await db
    .insertInto('progress')
    .values({
      date_week: date_week,
      progress: formatToDate(new Date()),
      type,
      done: false,
    })
    .returningAll()
    .executeTakeFirstOrThrow();

  return res;
}

export async function update(row: ProgressTableRow): Promise<void> {
  await db
    .updateTable('progress')
    .set({ progress: row.progress, done: row.done })
    .where('date_week', '=', row.date_week)
    .where('type', '=', row.type)
    .execute();
}

import { db } from '../db/client.js';
import { formatToDate } from '../utils/date.js';

import type { Database, ProgressTableRow, TX } from '../db/types.db.js';
import type { Kysely } from 'kysely';

export async function getActiveWeek(): Promise<{ currentWeek: string; previousWeek: string }> {
  const row = await db
    .selectFrom('progress')
    .selectAll()
    .where('type', '=', 'analyze')
    .where('done', '=', true)
    .orderBy('date_week', 'desc')
    .limit(2)
    .execute();
  return { currentWeek: row[0]!.date_week, previousWeek: row[1]!.date_week };
}

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

export async function update(trx: Kysely<Database> | TX, row: ProgressTableRow): Promise<void> {
  await trx
    .updateTable('progress')
    .set({ progress: row.progress, done: row.done })
    .where('date_week', '=', row.date_week)
    .where('type', '=', row.type)
    .execute();
}

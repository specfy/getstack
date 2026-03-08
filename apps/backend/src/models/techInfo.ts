import { db } from '../db/client.js';

import type { TechInfoInsert, TechInfoRow } from '../db/types.db.js';

export async function getTechInfo(key: string): Promise<null | TechInfoRow> {
  const row = await db
    .selectFrom('tech_info')
    .selectAll()
    .where('key', '=', key)
    .limit(1)
    .executeTakeFirst();
  return row || null;
}

export async function upsertTechInfo(data: TechInfoInsert): Promise<void> {
  await db
    .insertInto('tech_info')
    .values(data)
    .onConflict((oc) =>
      oc.column('key').doUpdateSet({
        long_description: data.long_description,
        website: data.website,
        github: data.github,
      })
    )
    .execute();
}

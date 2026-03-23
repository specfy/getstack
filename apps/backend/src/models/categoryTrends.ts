import { sql } from 'kysely';

import { db } from '../db/client.js';
import { nanoid } from '../utils/string.js';

import type { CategoryTrendsInsert, CategoryTrendsRow } from '../db/types.db.js';

export async function getCategoryTrendsRow(
  categoryName: string
): Promise<CategoryTrendsRow | null> {
  const row = await db
    .selectFrom('category_trends')
    .selectAll()
    .where('category', '=', categoryName)
    .executeTakeFirst();

  return row || null;
}

export async function upsertCategoryTrendsRow(
  input: Omit<CategoryTrendsInsert, 'id'>
): Promise<void> {
  const id = nanoid();
  await db
    .insertInto('category_trends')
    .values({
      id,
      category: input.category,
      introduction: input.introduction,
      slug: input.slug,
    })
    .onConflict((oc) =>
      oc.column('category').doUpdateSet({
        introduction: input.introduction,
        slug: sql`excluded.slug`,
      })
    )
    .execute();
}

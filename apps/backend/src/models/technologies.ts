import { db } from '../db/client.js';

import type { TechnologyInsert } from '../db/types.js';

export async function createTechnologies(input: TechnologyInsert[]): Promise<void> {
  const q = db.insertInto('technologies').values(input);
  console.log(q.compile());
  await q.execute();
}

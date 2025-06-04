import { db } from '../db/client.js';
import { envs } from '../utils/env.js';

import type { CacheRow } from '../db/types.js';

export async function getCache(key: string): Promise<CacheRow | undefined> {
  return await db.selectFrom('cache').selectAll().where('key', '=', key).executeTakeFirst();
}

export async function setCache({
  key,
  value,
  ttl,
}: {
  key: string;
  value: Record<string, unknown>;
  ttl: number;
}): Promise<void> {
  const expiresAt = new Date(Date.now() + ttl);
  const v = JSON.stringify(value);
  await db
    .insertInto('cache')
    .values({ key, value: v, expires_at: expiresAt })
    .onConflict((b) => {
      return b.column('key').doUpdateSet({ expires_at: expiresAt, value: v });
    })
    .execute();
}

export async function getOrCache<T>({
  keys,
  fn,
  ttl = 6 * 86_400 * 1000,
}: {
  keys: (number | string)[];
  fn: () => Promise<T>;
  ttl?: number;
}): Promise<T> {
  if (!envs.CACHE) {
    return fn();
  }

  const key = `${keys.join(';')}`;
  const cache = await getCache(key);
  if (cache && cache.expires_at.getTime() > Date.now()) {
    return cache.value as T;
  }

  const res = await fn();

  await setCache({ key, value: res as Record<string, unknown>, ttl });
  return res;
}

import { LRUCache } from 'lru-cache';

export const cache = new LRUCache({
  max: 10_000,

  // for use with tracking overall storage size
  maxSize: 50_000,

  sizeCalculation: () => {
    return 2;
  },

  // how long to live in ms
  ttl: 1000 * 86_400 * 7,

  // return stale items before removing from cache?
  allowStale: true,
});

export async function getOrCacheMemory<T>({
  keys,
  fn,
}: {
  keys: (number | string)[];
  fn: () => Promise<T>;
}): Promise<T> {
  const key = `${keys.join('')}`;
  const cached = cache.get(key);
  if (cached) {
    return cached as T;
  }

  const res = await fn();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  cache.set(key, res as any);
  return res;
}

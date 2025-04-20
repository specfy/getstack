import { setTimeout } from 'node:timers/promises';

export async function wait(num: number): Promise<void> {
  await setTimeout(num);
}

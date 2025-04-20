import { migrate } from './migration.js';

const res = await migrate();
// eslint-disable-next-line unicorn/no-process-exit
process.exit(res ? 0 : 1);

import { z } from 'zod';

const bool = z
  .enum(['true', 'false', ''])
  .optional()
  .default('false')
  .transform((value) => value === 'true');

const schema = z.object({
  // Global
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),

  // DB
  DATABASE_URL: z.string().url(),

  // Github
  GITHUB_TOKEN: z.string(),

  // CRON
  CRON_ANALYZE: bool,
  CRON_LIST: bool,
});

export const envs = schema.parse(process.env);

export const isProd = envs.NODE_ENV === 'production';

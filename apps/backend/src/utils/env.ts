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
  IS_GCP: bool,

  // DB
  DATABASE_URL: z.string().url(),
  CLICKHOUSE_DATABASE_URL: z.string().url(),

  // Github
  GITHUB_TOKEN: z.string(),

  // Algolia
  ALGOLIA_APP_ID: z.string().optional(),
  ALGOLIA_API_KEY: z.string().optional(),
  ALGOLIA_INDEX_NAME: z.string().optional(),

  // CRON
  CRON_LIST: bool,
  CRON_ANALYZE: bool,
  ANALYZE_REDO_BEFORE: z.coerce.date(),
  ANALYZE_MIN_STARS: z.coerce.number().default(3000),
  ANALYZE_MAX_SIZE: z.coerce.number().default(950_000),
  ANALYZE_WAIT: z.coerce.number().default(1000),

  // Newsletter
  BEEHIIV_PUBLICATION_ID: z.string().optional(),
  BEEHIIV_API_KEY: z.string().optional(),
});

export const envs = schema.parse(process.env);

export const isProd = envs.NODE_ENV === 'production';

import { z } from 'zod';

const schema = z.object({
  // Global
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),

  // DB
  DATABASE_URL: z.string().url(),

  // Github
  GITHUB_TOKEN: z.string(),
});

export const envs = schema.parse(process.env);

export const isProd = envs.NODE_ENV === 'production';

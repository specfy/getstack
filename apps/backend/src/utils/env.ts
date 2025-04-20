import { z } from 'zod';

const schema = z.object({
  // Global
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['production', 'development', 'test']).default('development'),

  // API
  API_HOSTNAME: z.string().min(1),
});

export const envs = schema.parse(process.env);

export const isProd = envs.NODE_ENV === 'production';

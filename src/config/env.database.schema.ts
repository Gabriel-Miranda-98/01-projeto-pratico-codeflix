import { z } from 'zod';

export const CONFIG_DB_SCHEMA = z.object({
  DB_VENDOR: z.enum(['sqlite', 'postgres']),
  DB_HOST: z.union([z.literal(':memory:'), z.string().url()]),
  DB_DATABASE: z.string().optional(),
  DB_USERNAME: z.string().optional(),
  DB_PASSWORD: z.string().optional(),
  DB_PORT: z.coerce.number().positive().optional(),
  DB_LOGGING: z.coerce.boolean().default(false),
  DB_AUTO_LOAD_MODELS: z.boolean().default(false),
});

export type ConfigDbSchema = z.infer<typeof CONFIG_DB_SCHEMA>;

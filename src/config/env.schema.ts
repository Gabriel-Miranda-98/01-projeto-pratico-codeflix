import { z } from 'zod';
import { CONFIG_DB_SCHEMA } from './env.database.schema';

export const envSchema = z
  .object({
    NODE_ENV: z.enum(['development', 'production', 'test']),
    PORT: z.coerce.number().positive().default(3000),
  })
  .merge(CONFIG_DB_SCHEMA)
  .refine(
    (data) => {
      if (data.DB_VENDOR === 'postgres') {
        return !!(
          data.DB_DATABASE &&
          data.DB_USERNAME &&
          data.DB_PASSWORD &&
          data.DB_PORT
        );
      }
      return true;
    },
    {
      message: 'Campos adicionais são obrigatórios para PostgreSQL',
      path: ['DB_VENDOR'],
    },
  )
  .refine(
    (data) => {
      return data.DB_VENDOR === 'sqlite'
        ? data.DB_HOST === ':memory:' || data.DB_HOST.startsWith('file:')
        : true;
    },
    {
      message:
        "Para SQLite, DB_HOST deve ser ':memory:' ou um caminho de arquivo válido",
      path: ['DB_HOST'],
    },
  );
export type EnvConfig = z.infer<typeof envSchema>;

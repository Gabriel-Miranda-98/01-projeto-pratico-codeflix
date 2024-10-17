import { z, ZodError } from 'zod';
import { EnvConfig, envSchema } from '../env.schema';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '../config.module';
import { join } from 'path';

describe('EnvSchema Validation', () => {
  const validateEnv = (env: Partial<EnvConfig>) => envSchema.safeParse(env);

  function expectZodError(result: z.SafeParseReturnType<any, any>, expectedErrors: Array<Partial<z.ZodIssue>>) {
    expect(result.success).toBe(false);
    if (!result.success) {
      expectedErrors.forEach(expectedError => {
        expect(result.error.issues).toContainEqual(expect.objectContaining(expectedError));
      });
    }
  }

  describe('NODE_ENV', () => {
    it.each(['development', 'production', 'test'])('should accept valid NODE_ENV: %s', (env:'development'|'production'|'test') => {
      const result = validateEnv({ NODE_ENV: env, DB_VENDOR: 'sqlite', DB_HOST: ':memory:' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid NODE_ENV', () => {
      const result = validateEnv({ NODE_ENV: 'invalid' as any, DB_VENDOR: 'sqlite', DB_HOST: ':memory:' });
      expectZodError(result, [{ code: 'invalid_enum_value', path: ['NODE_ENV'] }]);
    });
  });

  describe('PORT', () => {
    it('should accept valid PORT', () => {
      const result = validateEnv({ NODE_ENV: 'development', PORT: 3000, DB_VENDOR: 'sqlite', DB_HOST: ':memory:' });
      expect(result.success).toBe(true);
    });

    it('should coerce string PORT to number', () => {
      const result = validateEnv({ NODE_ENV: 'development', PORT: '3000' as any, DB_VENDOR: 'sqlite', DB_HOST: ':memory:' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.PORT).toBe(3000);
    });

    it('should reject negative PORT', () => {
      const result = validateEnv({ NODE_ENV: 'development', PORT: -3000, DB_VENDOR: 'sqlite', DB_HOST: ':memory:' });
      expectZodError(result, [{ code: 'too_small', path: ['PORT'] }]);
    });

    it('should use default PORT if not provided', () => {
      const result = validateEnv({ NODE_ENV: 'development', DB_VENDOR: 'sqlite', DB_HOST: ':memory:' });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.PORT).toBe(3000);
    });
  });

  describe('DB_VENDOR', () => {
    it.each([
      ['sqlite', { DB_HOST: ':memory:' }],
      ['postgres', {
        DB_HOST: 'postgresql://localhost:5432',
        DB_DATABASE: 'testdb',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'password',
        DB_PORT: 5432
      }]
    ])('should accept valid DB_VENDOR: %s', (vendor, additionalConfig) => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: vendor as 'sqlite' | 'postgres',
        ...additionalConfig
      });
      
      if (!result.success) {
        console.error('Validation failed:', result.error.format());
      }
      
      expect(result.success).toBe(true);
    });

    it('should reject invalid DB_VENDOR', () => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: 'mysql' as any,
        DB_HOST: 'localhost'
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe('invalid_enum_value');
        expect(result.error.issues[0].path).toContain('DB_VENDOR');
      }
    });
  });

  describe('DB_HOST', () => {
    it('should accept :memory: for SQLite', () => {
      const result = validateEnv({ NODE_ENV: 'development', DB_VENDOR: 'sqlite', DB_HOST: ':memory:' });
      expect(result.success).toBe(true);
    });

    it('should accept file: path for SQLite', () => {
      const result = validateEnv({ NODE_ENV: 'development', DB_VENDOR: 'sqlite', DB_HOST: 'file:./mydb.sqlite' });
      expect(result.success).toBe(true);
    });

    it('should accept valid URL for PostgreSQL', () => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: 'postgres', 
        DB_HOST: 'postgresql://localhost',
        DB_DATABASE: 'testdb',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_PORT: 5432
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid host for SQLite', () => {
      const result = validateEnv({ NODE_ENV: 'development', DB_VENDOR: 'sqlite', DB_HOST: 'invalid' });
      expectZodError(result, [{ path: ['DB_HOST'] }]);
    });

    it('should reject invalid URL for PostgreSQL', () => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: 'postgres', 
        DB_HOST: 'invalid',
        DB_DATABASE: 'testdb',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_PORT: 5432
      });
      expectZodError(result, [{ code: 'invalid_string', path: ['DB_HOST'] }]);
    });
  });

  describe('PostgreSQL specific fields', () => {
    it('should require additional fields for PostgreSQL', () => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: 'postgres', 
        DB_HOST: 'postgresql://localhost'
      });
      expectZodError(result, [{ path: ['DB_VENDOR'] }]);
    });

    it('should accept valid PostgreSQL configuration', () => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: 'postgres', 
        DB_HOST: 'postgresql://localhost',
        DB_DATABASE: 'testdb',
        DB_USERNAME: 'user',
        DB_PASSWORD: 'pass',
        DB_PORT: 5432
      });
      expect(result.success).toBe(true);
    });
  });

  describe('DB_LOGGING and DB_AUTO_LOAD_MODELS', () => {
    it('should accept boolean values', () => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: 'sqlite', 
        DB_HOST: ':memory:',
        DB_LOGGING: true,
        DB_AUTO_LOAD_MODELS: false
      });
      expect(result.success).toBe(true);
    });

    it('should coerce string to boolean for DB_LOGGING', () => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: 'sqlite', 
        DB_HOST: ':memory:',
        DB_LOGGING: 'true' as any
      });
      expect(result.success).toBe(true);
      if (result.success) expect(result.data.DB_LOGGING).toBe(true);
    });

    it('should use default values if not provided', () => {
      const result = validateEnv({ 
        NODE_ENV: 'development', 
        DB_VENDOR: 'sqlite', 
        DB_HOST: ':memory:'
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.DB_LOGGING).toBe(false);
        expect(result.data.DB_AUTO_LOAD_MODELS).toBe(false);
      }
    });
  });

  describe('Full Configuration', () => {
    it('should accept valid full SQLite configuration', () => {
      const result = validateEnv({
        NODE_ENV: 'development',
        PORT: 3000,
        DB_VENDOR: 'sqlite',
        DB_HOST: ':memory:',
        DB_LOGGING: true,
        DB_AUTO_LOAD_MODELS: true
      });
      expect(result.success).toBe(true);
    });

    it('should accept valid full PostgreSQL configuration', () => {
      const result = validateEnv({
        NODE_ENV: 'production',
        PORT: 8080,
        DB_VENDOR: 'postgres',
        DB_HOST: 'postgresql://localhost',
        DB_DATABASE: 'proddb',
        DB_USERNAME: 'admin',
        DB_PASSWORD: 'secure_password',
        DB_PORT: 5432,
        DB_LOGGING: false,
        DB_AUTO_LOAD_MODELS: true
      });
      expect(result.success).toBe(true);
    });

    it('should reject incomplete PostgreSQL configuration', () => {
      const result = validateEnv({
        NODE_ENV: 'production',
        PORT: 8080,
        DB_VENDOR: 'postgres',
        DB_HOST: 'postgresql://localhost',
        // Missing required PostgreSQL fields
      });
      expectZodError(result, [{ path: ['DB_VENDOR'] }]);
    });
  });
});



describe('ConfigModule Unit Tests', () => {
  it('should throw a ZodError when env vars are invalid', async () => {
    try {
      await Test.createTestingModule({
        imports: [ConfigModule.forRoot({
          envFilePath: join(__dirname, '.env.fake'),
        }),]
      }).compile();
      fail('ConfigModule should throw an error when env vars are invalid');

    } catch (error) {
      expect(error).toBeInstanceOf(ZodError);

    }
  });

  it('should contain specific error message for invalid DB_VENDOR', async () => {
    try {
      await Test.createTestingModule({
        imports: [
          ConfigModule.forRoot({
            envFilePath: join(__dirname, '.env.fake'),
          }),
        ],
      }).compile();
    } catch (error) {
      if (error instanceof ZodError) {
        const dbVendorError = error.errors.find(e => e.path.includes('DB_VENDOR'));
        expect(dbVendorError).toBeDefined();
        expect(dbVendorError?.message).toContain("Invalid enum value. Expected 'sqlite' | 'postgres', received 'fake'");
      } else {
        fail('Expected ZodError to be thrown');
      }
    }
  });


  it('should be valid with correct env vars', async () => {
    process.env.NODE_ENV = 'development';
    process.env.DB_VENDOR = 'sqlite';
    process.env.DB_HOST = ':memory:';

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
    }).compile();

    expect(module).toBeDefined();

    delete process.env.NODE_ENV;
    delete process.env.DB_VENDOR;
    delete process.env.DB_HOST;
  });


});
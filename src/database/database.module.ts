import { CategoryModel } from '@core/category/infra/db/sequelize/category.model';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { EnvConfig } from 'src/config/env.schema';
const models = [CategoryModel];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService<EnvConfig, true>) => {
        const DB_VENDOR = configService.get('DB_VENDOR');
        if (DB_VENDOR === 'sqlite') {
          return {
            dialect: DB_VENDOR,
            host: configService.get('DB_HOST'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
            define: {
              timestamps: false,
            },
          };
        }
        if (DB_VENDOR === 'postgres') {
          return {
            dialect: DB_VENDOR,
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
            define: {
              timestamps: false,
            },
          };
        }
        throw new Error('Unsupported database configuration: ' + DB_VENDOR);
      },

      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

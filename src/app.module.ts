import { Module } from '@nestjs/common';

import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get<ConfigService<EnvConfig, true>>(ConfigService);
  const port = configService.get('PORT',{ infer: true });
  await app.listen(port);
}
bootstrap();

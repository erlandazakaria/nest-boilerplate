import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { AppModule } from './module';

import { HttpExceptionFilter } from './libs/filter.exception';
import WinstonLogger from './libs/logger.winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonLogger,
    snapshot: true,
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableCors({
    origin: '*',
  });
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.HEADER,
    header: 'version',
    defaultVersion: '1.0.0',
  });

  await app.listen(process.env.PORT);
}
bootstrap();

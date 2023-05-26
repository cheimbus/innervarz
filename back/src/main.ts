import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { successInterceptor } from './common/success.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new successInterceptor());

  const currentPath = path.dirname(require.main.filename);
  app.use('/images', express.static(path.join(currentPath, `../src/images`)));

  const port = 8080;
  await app.listen(port);
  console.log(`listening on port: ${port}`);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as express from 'express';
import * as path from 'path';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { successInterceptor } from './common/success.interceptor';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new successInterceptor());

  const currentPath = path.dirname(require.main.filename);
  app.use('/image', express.static(path.join(currentPath, `../src/images`)));

  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  };
  app.enableCors(corsOptions);

  const port = 7929;
  await app.listen(port);
  console.log(`listening on port: ${port}`);
}
bootstrap();

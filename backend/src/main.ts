import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = await app.get(ConfigService);
  const port = config.get<number>('API_PORT');
  app.setGlobalPrefix('api');
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', config.get<string>('UPLOAD_PATH'))),
  );
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(port || 3003, () => {
    console.log(`App started on port: ${port}`);
  });
}
bootstrap();

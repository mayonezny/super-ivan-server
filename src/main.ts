import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyMultipart } from '@fastify/multipart';
import cookie from '@fastify/cookie';
import * as fs from 'fs';
import { join } from 'path';

const maxSize = 3 * 1024 * 1024;
const PORT = 8080;
async function bootstrap() {
  const keyPath = join(__dirname, '..', 'localhost-key.pem');
  const certPath = join(__dirname, '..', 'localhost.pem');

  const httpsOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: maxSize, https: httpsOptions }), { bodyParser: false });
  await app.register(fastifyMultipart, {
    attachFieldsToBody: true,
    // Включает поддержку multipart
  });
  await app.register(cookie, {

  });
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  await app.listen(process.env.PORT ?? PORT);
}
bootstrap();

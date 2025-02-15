import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import multipart, { fastifyMultipart } from '@fastify/multipart';

const PORT = 80;
async function bootstrap() {
  // eslint-disable-next-line max-len
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter(), { bodyParser: false });
  await app.register(fastifyMultipart, {
    attachFieldsToBody: true, // Включает поддержку multipart
  });

  await app.listen(process.env.PORT ?? PORT);
}
bootstrap();

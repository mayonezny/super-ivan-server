import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyMultipart } from '@fastify/multipart';
// eslint-disable-next-line no-magic-numbers
const maxSize = 3 * 1024 * 1024;
const PORT = 80;
async function bootstrap() {
  // eslint-disable-next-line max-len
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ bodyLimit: maxSize }), { bodyParser: false });
  await app.register(fastifyMultipart, {
    attachFieldsToBody: true,
    // Включает поддержку multipart
  });

  await app.listen(process.env.PORT ?? PORT);
}
bootstrap();

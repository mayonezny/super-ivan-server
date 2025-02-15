import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsModule } from './posts/posts.module';
import { MinioModule } from './services/minio/minio.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      // eslint-disable-next-line no-magic-numbers
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'kolobok2004',
      database: process.env.DB_NAME || 'super-ivan',
      autoLoadModels: true, // Автоматически загружать модели
      synchronize: true, // Использовать для разработки (в проде лучше миграции)
    }),
    PostsModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }

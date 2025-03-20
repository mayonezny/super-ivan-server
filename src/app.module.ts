import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsModule } from './posts/posts.module';
import { MinioModule } from './services/minio/minio.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // делает переменные доступными во всем проекте
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        dialect: 'postgres',
        host: configService.get<string>('DB_HOST'),
        // eslint-disable-next-line no-magic-numbers
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadModels: true, // Автоматически загружать модели
        synchronize: true, // Использовать для разработки (в проде лучше миграции)
      }),
      inject: [ConfigService],
    }),
    PostsModule,
    UsersModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }

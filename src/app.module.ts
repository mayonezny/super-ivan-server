import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsModule } from './posts/posts.module';
import { MinioModule } from './services/minio/minio.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { Dialect } from 'sequelize';
import { AuthModule } from './users/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,  // делает переменные доступными во всем проекте
    }),
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const dbConfig = {
          dialect: 'postgres' as Dialect,
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USER_DEV'),
          password: configService.get<string>('DB_PASSWORD_DEV'),
          database: configService.get<string>('DB_NAME'),
          autoLoadModels: true,
          synchronize: true,
        };

        return dbConfig;
      },
      inject: [ConfigService],
    }),
    PostsModule,
    UsersModule,
    AuthModule,
    MinioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }

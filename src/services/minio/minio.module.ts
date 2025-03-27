import { Module } from '@nestjs/common';
import { MinioController } from './minio.controller';
import { MinioService } from './minio.service';
import { AccessJwtStrategy } from 'src/users/auth/strategies/access.jwt.strategy';

@Module({
  imports: [],
  controllers: [MinioController],
  providers: [MinioService, AccessJwtStrategy],
})

export class MinioModule { }

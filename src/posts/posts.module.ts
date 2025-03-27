import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post } from './posts.model';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AccessJwtStrategy } from 'src/users/auth/strategies/access.jwt.strategy';

@Module({
  imports: [SequelizeModule.forFeature([Post])],
  controllers: [PostsController],
  providers: [PostsService, AccessJwtStrategy],
})
export class PostsModule {}

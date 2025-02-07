import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreationAttributes } from 'sequelize';
import { Post as PostModel } from './posts.model';

@Controller('api')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get('getposts')
  handleGetPosts(@Query('keyword') keyword: string | null): object {
    return this.postsService.returnPosts(keyword);
  }

  @Post('makepost')
  handleMakePost(@Body() body: CreationAttributes<PostModel>): object {
    return this.postsService.makePost(body);
  }
}
//пример тестовых данных:
// {
//   "pic": "/babka.png",
//   "title": "иВАaaaaaaНЧУК",
//   "author": "Zaparaaaaaa",
//   "content": "ОГО Уaaaaa"
//   }

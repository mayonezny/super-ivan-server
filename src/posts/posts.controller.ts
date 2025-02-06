import { Controller, Get, Post, Body } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreationAttributes } from 'sequelize';
import { Post as PostModel } from './posts.model';

@Controller('api')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  //   @Get('zaparka')
  //   getHello(): object {
  //     console.log('allo');
  //     return this.postsService.getHello();
  //   }
  //   @Post('tatarka')
  //   handlePost(@Body() body: any): string {
  //     console.log('body' + body.boris);
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  //     return this.postsService.handlePost(body);
  //   }
  @Get('getposts')
  handleGetPosts(): object {
    return this.postsService.returnPosts();
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

// eslint-disable-next-line max-len
import { Controller, Get, Post, Body, Query, Delete, Param, HttpException, HttpStatus, Put, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreationAttributes } from 'sequelize';
import { Post as PostModel } from './posts.model';
import { AuthGuard } from '@nestjs/passport';

@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get('getposts')
  handleGetPosts(@Query('keyword') keyword: string | null): object {
    return this.postsService.returnPosts(keyword);
  }
  @UseGuards(AuthGuard('jwt-access'))
  @Post('addpost')
  handleMakePost(@Body() body: CreationAttributes<PostModel>): object {
    return this.postsService.makePost(body);
  }
  @UseGuards(AuthGuard('jwt-access'))
  @Put('updatepost/:id')
  handleUpdatePost(@Param('id') id: string, @Body() body: CreationAttributes<PostModel>): object{
    return this.postsService.updatePost(Number(id), body);
  }
  @UseGuards(AuthGuard('jwt-access'))
  @Delete('deletepost/:id')
  async deletePost(@Param('id') id: string) {
    const deleted = await this.postsService.deletePost(Number(id));
    if (!deleted) {
      throw new HttpException('Пост не найден', HttpStatus.NOT_FOUND);
    }
    return { message: 'Пост успешно удалён' };
  }
}
//пример тестовых данных:
// {
//   "pic": "/babka.png",
//   "title": "иВАaaaaaaНЧУК",
//   "author": "Zaparaaaaaa",
//   "content": "ОГО Уaaaaa"
//   }

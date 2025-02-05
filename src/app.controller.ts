import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): object {
    console.log('allo');
    return this.appService.getHello();
  }
  @Post()
  handlePost(@Body() body: any): string {
    console.log('body' + body.boris);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.appService.handlePost(body);
  }
  @Get('getposts')
  handleGetPosts(): object {
    return this.appService.handleGetPosts();
  }
}

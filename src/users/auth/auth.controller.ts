
import { Controller, Get, Post, Body, Query, Delete, Param, HttpException, HttpStatus, Put, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreationAttributes } from 'sequelize';
import { User } from '../users.model';
import { UUID } from 'crypto';
import { UsersService } from '../users.service';
import { FastifyReply } from 'fastify';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly usersService: UsersService) { }

  // @Get('fetchusers')
  // handleFetchUsers(@Query('keyword') keyword: string | null): object {
  //   return this.usersService.fetchUsers(keyword);
  // }

  // @Post('createuser')
  // handleCreateUser(@Body() body: CreationAttributes<User>): object {
  //   return this.usersService.createUser(body);
  // }

  @Post('register')
  async handleRegister(@Body() body: CreationAttributes<User>, @Res() reply: FastifyReply): Promise<void> {
    console.log(body);
    const { email, password, accessToken, refreshToken } = await this.authService.register(body);
    console.log('zzz', refreshToken);
    try{
      await this.usersService.createUser({ email, password });
    } catch(err: unknown){
      console.log(err);
      reply.status(500).send({ err: err });
    }
    reply.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 20 * 24 * 60 * 60, // Fastify ожидает время в секундах
      path:'/',
    })
      .send({ accessToken: accessToken });
  }

  // @Put('updateuser/:uuid')
  // handleUpdateUser(@Param('uuid') uuid: UUID, @Body() body: CreationAttributes<User>): object{
  //   console.log(uuid, '  ыщыф  ', body);
  //   return this.usersService.updateUser(uuid, body);
  // }

  // @Delete('deleteuser/:uuid')
  // async deleteUser(@Param('uuid') uuid: UUID) {
  //   const deleted = await this.usersService.deleteUser(uuid);
  //   if (!deleted) {
  //     throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
  //   }
  //   return { message: 'Пользователь успешно удалён' };
  // }
}
//пример тестовых данных:
// {
//   "pic": "/babka.png",
//   "title": "иВАaaaaaaНЧУК",
//   "author": "Zaparaaaaaa",
//   "content": "ОГО Уaaaaa"
//   }

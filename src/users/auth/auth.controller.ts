
import { Controller, Get, Post, Body, Query, Delete, Param, HttpException, HttpStatus, Put, Res, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreationAttributes } from 'sequelize';
import { User } from '../users.model';
import { UUID } from 'crypto';
import { UsersService } from '../users.service';
import { FastifyReply, FastifyRequest } from 'fastify';

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
  async handleRegister(@Body() body: CreationAttributes<User> & { doNotRemember?: boolean }, @Res() res: FastifyReply): Promise<void> {
    console.log(body);
    const { email, password, accessToken, refreshToken } = await this.authService.register(body);
    console.log('zzz', refreshToken);
    try{
      await this.usersService.createUser({ email, password });
    } catch(err: unknown){
      console.log(err);
      res.status(500).send({ error: err });
    }
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      ...(body.doNotRemember ? {} : { maxAge: 20 * 24 * 60 * 60 }), // Fastify ожидает время в секундах
      path:'/',
    })
      .send({ accessToken: accessToken });
  }

  @Post('login')
  async handleLogin(@Body() body: CreationAttributes<User> & { doNotRemember?: boolean }, @Res() res: FastifyReply): Promise<void> {
    console.log(body);
    try{
      const { accessToken, refreshToken } = await this.authService.login(body);
      console.log(body.doNotRemember);
      if(accessToken !== '' && refreshToken !== ''){
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          ...(body.doNotRemember ? {} : { maxAge: 20 * 24 * 60 * 60 }), // Fastify ожидает время в секундах
          path:'/',
        })
          .send({ accessToken: accessToken });
      } else{
        res.status(500).send('Что-то пошло не так, токены пустые');
      }
    } catch(error: any){
      res.status(400).send(error.message);
    }
  }

  @Post('logout')
  handleLogout(@Res() response: FastifyReply){
    response.clearCookie('refreshToken', { path: '/', secure: true, sameSite: 'none' }).send( {message: 'Кука удалена!'} );
  }

  @Post('refresh')
  async handleRefresh(@Req() req: FastifyRequest, @Res() res: FastifyReply): Promise<void> {
    try {
      // Берём refresh-токен из кук

      const refreshToken = req.cookies?.refreshToken;
      console.log('rtyr', refreshToken);
      if (refreshToken === undefined) {
        //console.log('sdfsdf', req);
        throw new UnauthorizedException('Refresh token отсутствует');
      }

      // Проверяем и валидируем refresh-токен
      const tokens = await this.authService.refreshToken(refreshToken);

      // Ставим новый refresh-токен в cookie
      res
        .cookie('refreshToken', tokens.refreshToken, {
          httpOnly: true,
          secure: true, // HTTPS-only
          sameSite: 'none', // Или 'lax', в зависимости от вашей ситуации
          maxAge: 20 * 24 * 60 * 60,
          path: '/',
        })
        .send({ accessToken: tokens.accessToken, email: tokens.email });

    } catch (error) {
      throw new UnauthorizedException('Refresh token невалиден или истёк');
    }
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

// eslint-disable-next-line max-len
import { Controller, Get, Post, Body, Query, Delete, Param, HttpException, HttpStatus, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreationAttributes } from 'sequelize';
import { User } from './users.model';
import { UUID } from 'crypto';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Get('fetchusers')
  handleFetchUsers(@Query('keyword') keyword: string | null): object {
    return this.usersService.fetchUsers(keyword);
  }

  @Post('createuser')
  handleCreateUser(@Body() body: CreationAttributes<User>): object {
    console.log(body);
    return this.usersService.createUser(body);
  }

  @Put('updateuser/:uuid')
  handleUpdateUser(@Param('uuid') uuid: UUID, @Body() body: CreationAttributes<User>): object{
    console.log(uuid, '  ыщыф  ', body);
    return this.usersService.updateUser(uuid, body);
  }

  @Delete('deleteuser/:uuid')
  async deleteUser(@Param('uuid') uuid: UUID) {
    const deleted = await this.usersService.deleteUser(uuid);
    if (!deleted) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }
    return { message: 'Пользователь успешно удалён' };
  }
}
//пример тестовых данных:
// {
//   "pic": "/babka.png",
//   "title": "иВАaaaaaaНЧУК",
//   "author": "Zaparaaaaaa",
//   "content": "ОГО Уaaaaa"
//   }

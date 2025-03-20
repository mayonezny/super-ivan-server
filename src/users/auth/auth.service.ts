/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users.model';
import { CreationAttributes, Op } from 'sequelize';
import { Sequelize } from 'sequelize'; // Правильный импорт для fn
import { UUID } from 'crypto';

// Далее используем Sequelize.fn

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  createUser(data: CreationAttributes<User>):Promise<User>{
    return this.userModel.create(data);
  }

  updateUser(uuid: UUID, data: CreationAttributes<User>){
    return this.userModel.update(data, { where: { uuid }, returning: true, individualHooks: true });
  }

  async deleteUser(uuid: UUID): Promise<boolean> {
    const deleted = await this.userModel.destroy({ where: { uuid } });
    return deleted > 0; // Если удалено больше 0 строк, значит удаление прошло успешно
  }
}


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreationAttributes, Op } from 'sequelize';
import { UUID } from 'crypto';

// Далее используем Sequelize.fn

@Injectable()
export class UsersService {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  fetchUsers(keyword?: string | null){
    const safeKeyword: string | null = keyword ? keyword.replace(' ', '&') : null;
    return safeKeyword ? this.userModel.findAll({
      where: {
        [Op.or]: [
          {
            // title: {
            //   [Op.match]: Sequelize.fn('to_tsquery', 'russian', `${safeKeyword}:*`),
            // },
          },
          {
            // author: {
            //   [Op.match]: Sequelize.fn('to_tsquery', 'russian', `${safeKeyword}:*`),
            // },
          },
        ],
      },
    }): this.userModel.findAll();
  }

  findUser(email: string):Promise<User | null>{
    return this.userModel.findOne({ where: { email } })
  }

  returnField(email: string, fieldName: string){
    return this.userModel.findOne({ where: { email }, attributes: [ fieldName ] });
  }

  createUser(data):Promise<User>{
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


import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users.model';
import { CreationAttributes, Op } from 'sequelize';
import { Sequelize } from 'sequelize'; // Правильный импорт для fn
import { UUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

// Далее используем Sequelize.fn

@Injectable()
export class AuthService {

  constructor(@InjectModel(User) private userModel: typeof User, private configService: ConfigService) {}

  private readonly jwtSecret = this.configService.get<string>('JWT_SECRET') || 'invalid secret (.env access troubles)';
  private readonly jwtRefreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET') || 'invalid refresh secret (.env access troubles)';

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10); // Генерация соли
    const hashedPassword = await bcrypt.hash(password, salt); // Хеширование пароля с солью
    return hashedPassword;
  }

  // Сравнение пароля с хешем
  async comparePasswords(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword); // Сравниваем пароль с хешем
  }

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.jwtSecret, { expiresIn: '20min' }) as string; // Генерация токена с 20min сроком действия
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.jwtRefreshSecret, { expiresIn: '30d' }) as string; // Генерация токена с 30days сроком действия
  }

  verifyToken(token: string, refresh: boolean = false): any {
    try {
      return !refresh ? jwt.verify(token, this.jwtSecret) : jwt.verify(token, this.jwtRefreshSecret); // Проверка и декодирование токена
    } catch (error) {
      return error; // Если токен невалиден
    }
  }

  async register(data: CreationAttributes<User>){ //АЛЕРТ! ТУТ УБРАН ПРОМИС! МОЖЕТ БЫТЬ БАБАХ!
    const { email, password } = data;
    const hashedPassword = await this.hashPassword(password);
    const token = this.generateAccessToken({ email });
    return { email: email, password: hashedPassword, token: token};
  }

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


import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../users.model';
import { CreationAttributes, Op } from 'sequelize';
import { UUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

// Далее используем Sequelize.fn

@Injectable()
export class AuthService {

  constructor(@InjectModel(User) private userModel: typeof User, private configService: ConfigService, private readonly jwtService: JwtService) {}

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
    return this.jwtService.sign(payload, {
      secret: this.jwtSecret,
      expiresIn: '10m',
    }); // Генерация токена с 10min сроком действия
  }

  generateRefreshToken(payload: object): string {
    return this.jwtService.sign(payload, {
      secret: this.jwtRefreshSecret,
      expiresIn: '20d',
    }); // Генерация токена с 30days сроком действия
  }

  async refreshToken(token: string){
    try {
      const decoded = this.jwtService.verify(token, { secret: this.configService.get('JWT_REFRESH_SECRET') });
  
      const email = decoded.email;
  
      // Опционально: проверить, есть ли пользователь с таким id и не заблокирован ли он.
  
      const payload = { email: email };
  
      // Генерируем новые токены
      const accessToken = this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET'), expiresIn: '10m' });
      const refreshToken = this.jwtService.sign(payload, { secret: this.configService.get('JWT_REFRESH_SECRET'), expiresIn: '20d' });
  
      return { accessToken, refreshToken };
      
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  // verifyToken(token: string, refresh: boolean = false): any {
  //   try {
  //     return !refresh ? jwt.verify(token, this.jwtSecret) : jwt.verify(token, this.jwtRefreshSecret); // Проверка и декодирование токена
  //   } catch (error) {
  //     return error; // Если токен невалиден
  //   }
  // }

  async register(data: CreationAttributes<User>){ //АЛЕРТ! ТУТ УБРАН ПРОМИС! МОЖЕТ БЫТЬ БАБАХ!
    const { email, password } = data;
    const hashedPassword = await this.hashPassword(password);
    const accessToken = this.generateAccessToken({ email });
    const refreshToken = this.generateRefreshToken({ email });
    return { email: email, password: hashedPassword, accessToken: accessToken, refreshToken: refreshToken};
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

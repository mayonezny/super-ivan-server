import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users.model';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccessJwtStrategy } from './strategies/access.jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh.jwt.strategy';
@Module({
  imports: [
    SequelizeModule.forFeature([User]),
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const jwtConfig = {
          secret: configService.get<string>('JWT_SECRET') || 'ivan', // Дефолтный секрет
          signOptions: { expiresIn: '10m' },
        };
        return jwtConfig;
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersService, AccessJwtStrategy, RefreshJwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';

export interface JwtPayload {
  email: string
}
//в какой-нибудь обнове сделать чтобы при validate была проверка пользователя в бд
@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(private readonly configService: ConfigService) {
    const jwtSecret = configService.get<string>('JWT_SECRET') || 'invalid secret (.env access troubles)';
    console.log(jwtSecret);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    super({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() ,
      ignoreExpiration: false,
      secretOrKey: jwtSecret, // здесь теперь точно string
    } as StrategyOptionsWithoutRequest);
  }

  validate(payload: JwtPayload): { email: string } {
    return { email: payload.email };
  }
}

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptionsWithoutRequest } from 'passport-jwt';
import { JwtPayload } from './access.jwt.strategy';

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly configService: ConfigService) {
    const jwtRefreshSecret = configService.get<string>('JWT_REFRESH_SECRET') || 'invalid secret (.env access troubles)';

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken() ,
      ignoreExpiration: false,
      secretOrKey: jwtRefreshSecret, // здесь теперь точно string
    } as StrategyOptionsWithoutRequest);
  }

  validate(payload: JwtPayload): { email: string } {
    return { email: payload.email };
  }
}

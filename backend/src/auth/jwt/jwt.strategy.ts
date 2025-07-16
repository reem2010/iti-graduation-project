import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private config: ConfigService) {
    const secret = config.get<string>('jwt_secret_key');
    if (!secret) {
      throw new Error('JWT_SECRET_KEY is not defined in the .env file');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log(
      'JWT Payload:',
      payload.userId,
      payload.email,
      payload.role,
      payload.phone,
    );
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      phone: payload.phone,
    };
  }
}

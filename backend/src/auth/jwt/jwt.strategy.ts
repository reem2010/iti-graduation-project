import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'secret123',
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

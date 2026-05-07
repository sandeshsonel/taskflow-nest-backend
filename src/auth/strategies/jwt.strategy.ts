import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get<string>('auth.jwtSecret');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * Passport calls this after verifying the JWT signature.
   * The returned object is attached to `req.user`.
   */
  async validate(payload: JwtPayload) {
    return {
      id: payload.id,
      fullName: payload.fullName,
      email: payload.email,
      firebaseUID: payload.firebaseUID,
      role: payload.role,
    };
  }
}

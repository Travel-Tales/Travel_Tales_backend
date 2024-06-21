import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { IPayload } from 'src/jwt/interfaces';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'refresh',
) {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.cookies?.refresh;
        return cookie;
      },
      ignoreExpiration: false,
      algorithms: ['HS256'],
      secretOrKey: process.env.REFRESH_SECRET_KEY,
    });
  }

  async validate(payload: IPayload): Promise<IPayload> {
    return payload;
  }
}

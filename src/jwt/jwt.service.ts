import { Injectable } from '@nestjs/common';
import { IPayload } from './interfaces';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  createAccessToken(payload: IPayload): string {
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: process.env.ACCESS_SECRET_EXPIRATION,
    });
  }

  createRefreshToken(payload: IPayload): string {
    return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
      expiresIn: process.env.REFRESH_SECRET_EXPIRATION,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { IPayload } from './interfaces';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities';

@Injectable()
export class JwtService {
  createAccessToken(userInfo: User): string {
    const payload = this.createPayload(userInfo);
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
      expiresIn: process.env.ACCESS_SECRET_EXPIRATION,
    });
  }

  createRefreshToken(userInfo: User): string {
    const payload = this.createPayload(userInfo);
    return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
      expiresIn: process.env.REFRESH_SECRET_EXPIRATION,
    });
  }

  verifyAccessToken(token: string) {}

  private createPayload(userInfo: User): IPayload {
    return {
      id: userInfo.id,
      nickname: userInfo.nickname,
      email: userInfo.email,
      loginType: userInfo.loginType,
    };
  }
}

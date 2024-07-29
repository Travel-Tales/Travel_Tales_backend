import { Injectable } from '@nestjs/common';
import { IPayload } from './interfaces';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/entities';
import { ExpiredTokenException } from 'src/common/exceptions/service.exception';

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

  verifyAccessToken(token: string): IPayload {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
      return this.createPayload(decoded);
    } catch (e) {
      this.thorwException(e);
    }
  }

  verifyRefreshToken(token: string): IPayload {
    try {
      const decoded = jwt.verify(token, process.env.REFRESH_SECRET_KEY);
      return this.createPayload(decoded);
    } catch (e) {
      this.thorwException(e);
    }
  }

  private createPayload(userInfo: User): IPayload {
    return {
      id: userInfo.id,
      nickname: userInfo.nickname,
      email: userInfo.email,
      loginType: userInfo.loginType,
    };
  }

  private thorwException(e: Error): void {
    switch (e.message) {
      case 'jwt expired':
        throw ExpiredTokenException('Expired token');

      case 'jwt malformed':
        throw ExpiredTokenException('Malformed token');

      default:
        throw ExpiredTokenException('Invalid signature');
    }
  }
}

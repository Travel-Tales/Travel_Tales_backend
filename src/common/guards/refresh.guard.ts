import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';
import { ForbiddenException } from '../exceptions/service.exception';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const refreshToken: string = req.cookies?.refresh;

    if (!refreshToken) {
      throw ForbiddenException();
    }

    let decodedToken;

    try {
      decodedToken = this.jwtService.verifyRefreshToken(refreshToken);
    } catch (e) {
      res.clearCookie('refresh');

      throw e;
    }

    if (typeof decodedToken === 'object' && decodedToken.hasOwnProperty('id')) {
      const user = await this.userService.getUserInfo(decodedToken.id);

      if (!user) {
        throw ForbiddenException('User not found');
      }

      req.user = user;
    }
    return true;
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';
import { AllowedRoles } from '../decorators/role.decorator';
import { ForbiddenException } from '../exceptions/service.exception';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {} //Reflector는 metadata를 get한다.
  //nest js의 ExecutionContext
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles', //@Role 데코레이터에서 roles라는 키를 가져온다.
      context.getHandler(),
    );

    if (!roles || roles.includes('Any')) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
      throw ForbiddenException();
    }

    const token = authorizationHeader.split(' ')[1];

    const decodedToken = this.jwtService.verifyAccessToken(token);

    if (typeof decodedToken === 'object' && decodedToken.hasOwnProperty('id')) {
      const user = await this.userService.getUserInfo(decodedToken.id);

      if (!user) {
        throw ForbiddenException('User not found');
      }
      req.user = user;
      return roles.includes(user.loginType);
    }

    return false;
  }
}

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AllowedRoles } from '../decorators/role.decorator';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {} //Reflector는 metadata를 get한다.
  //nest js의 ExecutionContext
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      'roles', //@Role 데코레이터에서 roles라는 키를 가져온다.
      context.getHandler(),
    );

    if (!roles || roles.includes('Any')) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    if (!user) {
      return false;
    }

    return roles.includes(user.loginType);
  }
}

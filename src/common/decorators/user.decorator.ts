import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IPayload } from 'src/jwt/interfaces';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): IPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

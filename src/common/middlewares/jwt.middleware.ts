import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UserService } from 'src/user/user.service';
import { JwtService } from 'src/jwt/jwt.service';
import { Response, Request } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  //토큰을 받기 위한 미들웨어를 구현
  async use(req: Request, res: Response, next: NextFunction) {
    if (req.cookies.access) {
      const token = req.headers.authorization.split(' ')[1];

      const user = this.jwtService.verifyAccessToken(token);
      if (typeof user === 'object' && user.hasOwnProperty('id')) {
        req['user'] = user;
      }
    } else {
      req['user'] = null;
    }

    next();
  }
}

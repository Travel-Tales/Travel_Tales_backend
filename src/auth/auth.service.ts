import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { User, UserLoginType } from 'src/entities';
import { IPayload, ITokens } from 'src/jwt/interfaces';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async loginGoogle(user: Profile, loginType: UserLoginType): Promise<ITokens> {
    let userInfo = await this.userService.getUserInfoByEmail(user._json.email);

    if (!userInfo) {
      userInfo = await this.userService.createUserInfo(
        user._json.email,
        loginType,
      );
    }

    const refresh = this.jwtService.createRefreshToken(userInfo);

    return { refresh };
  }

  async loginKakao(user: Profile, loginType: UserLoginType): Promise<ITokens> {
    let userInfo = await this.userService.getUserInfoByEmail(
      user._json.kakao_account.email,
    );

    if (!userInfo) {
      userInfo = await this.userService.createUserInfo(
        user._json.kakao_account.email,
        loginType,
      );
    }

    const refresh = this.jwtService.createRefreshToken(userInfo);

    return { refresh };
  }

  async updateAccessToken(user: IPayload): Promise<ITokens> {
    let userInfo = await this.userService.getUserInfoByEmail(user.email);

    const refresh = this.jwtService.createRefreshToken(userInfo);
    const access = this.jwtService.createAccessToken(userInfo);

    return { refresh, access };
  }
}

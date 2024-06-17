import { Injectable } from '@nestjs/common';
import { Profile } from 'passport-google-oauth20';
import { User, UserLoginType } from 'src/entities';
import { IPayload } from 'src/jwt/interfaces';
import { JwtService } from 'src/jwt/jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async loginGoogle(user: Profile, loginType: UserLoginType): Promise<string> {
    let userInfo = await this.userService.getUserInfoByEmail(user._json.email);

    if (!userInfo) {
      userInfo = await this.userService.createUserInfo(
        user._json.email,
        loginType,
      );
    }

    const paylaod = this.createPayload(userInfo);

    return this.jwtService.createRefreshToken(paylaod);
  }

  async loginKakao(user: Profile, loginType: UserLoginType): Promise<string> {
    let userInfo = await this.userService.getUserInfoByEmail(
      user._json.kakao_account.email,
    );

    if (!userInfo) {
      userInfo = await this.userService.createUserInfo(
        user._json.kakao_account.email,
        loginType,
      );
    }

    const paylaod = this.createPayload(userInfo);

    return this.jwtService.createRefreshToken(paylaod);
  }

  private createPayload(userInfo: User): IPayload {
    return {
      id: userInfo.id,
      nickname: userInfo.nickname,
      email: userInfo.email,
      loginType: userInfo.loginType,
    };
  }
}

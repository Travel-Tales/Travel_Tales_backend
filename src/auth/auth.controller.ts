import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User, UserLoginType } from 'src/entities';
import { ITokens } from 'src/jwt/interfaces';
import {
  ApiTags,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { UserInfo } from 'src/common/decorators/userInfo.decorator';
import { Role } from 'src/common/decorators/role.decorator';
import { RefreshGuard } from 'src/common/guards/refresh.guard';
import { Response } from 'express';
import { ICookieOptions } from './interfaces';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: '구글 로그인 API',
    description: '구글 로그인',
  })
  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(): Promise<void> {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @ApiExcludeEndpoint()
  async googleAuthCallback(@UserInfo() userInfo: User, @Res() res) {
    const { refresh } = await this.authService.loginGoogle(
      userInfo,
      UserLoginType.Google,
    );

    this.setCookie(res, 'refresh', refresh);

    return res.json();
  }

  @ApiOperation({
    summary: '카카오 로그인 API',
    description: '카카오 로그인',
  })
  @UseGuards(AuthGuard('kakao'))
  @Get('kakao')
  async kakaoAuth(): Promise<void> {}

  @UseGuards(AuthGuard('kakao'))
  @Get('kakao/callback')
  @ApiExcludeEndpoint()
  async kakaoAuthCallback(@UserInfo() userInfo: User, @Res() res) {
    const { refresh } = await this.authService.loginKakao(
      userInfo,
      UserLoginType.Kakao,
    );

    this.setCookie(res, 'refresh', refresh);

    return res.json();
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: '엑세스 토큰 재발급 API',
    description: '엑세스 토큰 재발급',
  })
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async updateAccessToken(
    @UserInfo() userInfo: User,
    @Res({ passthrough: true }) res,
  ): Promise<ITokens> {
    const { refresh, access } =
      await this.authService.updateAccessToken(userInfo);

    res.cookie('refresh', refresh, {
      httpOnly: true,
    });

    return { access };
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃',
  })
  @UseGuards(RefreshGuard)
  @Post('logout')
  async logout(@Res({ passthrough: true }) res): Promise<void> {
    res.clearCookie('refresh');
  }

  setCookie(res: Response, cookieName: string, cookieValue) {
    const cookieOption: ICookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'prod',
      sameSite: 'strict',
      domain:
        process.env.NODE_ENV === 'prod' ? 'www.traveltales.kr' : 'localhost',
      maxAge: 3 * 24 * 60 * 60 * 1000,
    };

    return res.cookie(cookieName, cookieValue, cookieOption);
  }
}

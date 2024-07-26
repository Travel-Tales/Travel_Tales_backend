import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { User, UserLoginType } from 'src/entities';
import { ITokens } from 'src/jwt/interfaces';
import { ApiTags, ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { UserInfo } from 'src/common/decorators/userInfo.decorator';
import { Role } from 'src/common/decorators/role.decorator';

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

    res.cookie('refresh', refresh, {
      httpOnly: true,
    });

    return res.status(200).redirect(process.env.REDIRECT_URL);
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

    res.cookie('refresh', refresh, {
      httpOnly: true,
    });

    return res.status(200).redirect(process.env.REDIRECT_URL);
  }

  @ApiOperation({
    summary: '엑세스 토큰 재발급 API',
    description: '엑세스 토큰 재발급',
  })
  @Role(['Kakao', 'Google'])
  @UseGuards(AuthGuard('refresh'))
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

  @ApiOperation({
    summary: '로그아웃 API',
    description: '로그아웃',
  })
  @Role(['Kakao', 'Google'])
  @UseGuards(AuthGuard('refresh'))
  @Post('logout')
  async logout(@Res({ passthrough: true }) res): Promise<void> {
    res.clearCookie('refresh');
  }
}

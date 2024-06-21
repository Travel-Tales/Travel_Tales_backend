import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserLoginType } from 'src/entities';
import { ITokens } from 'src/jwt/interfaces';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(): Promise<void> {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  async googleAuthCallback(@Req() req, @Res() res) {
    const { refresh } = await this.authService.loginGoogle(
      req.user,
      UserLoginType.Google,
    );

    res.cookie('refresh', refresh, {
      httpOnly: true,
    });

    return res.status(200).redirect(process.env.REDIRECT_URL);
  }

  @UseGuards(AuthGuard('kakao'))
  @Get('kakao')
  async kakaoAuth(): Promise<void> {}

  @UseGuards(AuthGuard('kakao'))
  @Get('kakao/callback')
  async kakaoAuthCallback(@Req() req, @Res() res) {
    const refresh = await this.authService.loginKakao(
      req.user,
      UserLoginType.Kakao,
    );

    res.cookie('refresh', refresh, {
      httpOnly: true,
    });

    return res.status(200).redirect(process.env.REDIRECT_URL);
  }

  @Post('refresh')
  @UseGuards(AuthGuard('refresh'))
  async updateAccessToken(
    @Req() req,
    @Res({ passthrough: true }) res,
  ): Promise<ITokens> {
    const { refresh, access } = await this.authService.updateAccessToken(
      req.user,
    );

    res.cookie('refresh', refresh, {
      httpOnly: true,
    });

    return { access };
  }
}

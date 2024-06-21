import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserLoginType } from 'src/entities';
import { ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('google'))
  @Get('google')
  async googleAuth(): Promise<void> {}

  @UseGuards(AuthGuard('google'))
  @Get('google/callback')
  @ApiExcludeEndpoint()
  async googleAuthCallback(@Req() req, @Res() res) {
    const refreshToken = await this.authService.loginGoogle(
      req.user,
      UserLoginType.Google,
    );

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
    });

    return res.status(200).redirect(process.env.REDIRECT_URL);
  }

  @UseGuards(AuthGuard('kakao'))
  @Get('kakao')
  async kakaoAuth(): Promise<void> {}

  @UseGuards(AuthGuard('kakao'))
  @Get('kakao/callback')
  @ApiExcludeEndpoint()
  async kakaoAuthCallback(@Req() req, @Res() res) {
    const refreshToken = await this.authService.loginKakao(
      req.user,
      UserLoginType.Kakao,
    );

    res.cookie('refresh', refreshToken, {
      httpOnly: true,
    });

    return res.status(200).redirect(process.env.REDIRECT_URL);
  }
}

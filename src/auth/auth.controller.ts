import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserLoginType } from 'src/entities';
import { ITokens } from 'src/jwt/interfaces';
import { ApiTags, ApiExcludeEndpoint, ApiOperation } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';

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
  async googleAuthCallback(@User() user, @Res() res) {
    const { refresh } = await this.authService.loginGoogle(
      user,
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
  async kakaoAuthCallback(@User() user, @Res() res) {
    const { refresh } = await this.authService.loginKakao(
      user,
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
  @Post('refresh')
  @UseGuards(AuthGuard('refresh'))
  async updateAccessToken(
    @User() user,
    @Res({ passthrough: true }) res,
  ): Promise<ITokens> {
    const { refresh, access } = await this.authService.updateAccessToken(user);

    res.cookie('refresh', refresh, {
      httpOnly: true,
    });

    return { access };
  }
}

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { KakaoStrategy } from 'src/common/strategies/kakao.strategy';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserModule } from 'src/user/user.module';
import { RefreshTokenStrategy } from 'src/common/strategies/jwt.strategy';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy, RefreshTokenStrategy],
})
export class AuthModule {}

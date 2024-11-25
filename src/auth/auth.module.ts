import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from '../common/strategies/google.strategy';
import { KakaoStrategy } from '../common/strategies/kakao.strategy';
import { JwtModule } from '../jwt/jwt.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy],
})
export class AuthModule {}

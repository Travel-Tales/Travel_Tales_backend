import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { GoogleStrategy } from 'src/common/strategies/google.strategy';
import { KakaoStrategy } from 'src/common/strategies/kakao.strategy';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [JwtModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, KakaoStrategy],
})
export class AuthModule {}

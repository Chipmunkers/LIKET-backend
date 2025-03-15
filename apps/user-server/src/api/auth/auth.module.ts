import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashModule } from '../../common/module/hash/hash.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import kakaoLoginConfig from './strategy/kakao/config/kakao-login.config';
import { KakaoLoginStrategy } from './strategy/kakao/kakao-login.strategy';
import { UserModule } from '../user/user.module';
import { HttpModule } from '@nestjs/axios';
import httpConfig from './config/http.config';
import { SocialLoginJwtModule } from '../../common/module/social-login-jwt/social-login-jwt.module';
import { LoginJwtModule } from '../../common/module/login-jwt/login-jwt.module';
import { UtilModule } from '../../common/module/util/util.module';
import naverLoginConfig from './strategy/naver/config/naver-login.config';
import { NaverLoginStrategy } from './strategy/naver/naver-login.strategy';
import appleLoginConfig from './strategy/apple/config/apple-login.config';
import { AppleLoginStrategy } from './strategy/apple/apple-login.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserCoreModule } from 'libs/core/user/user-core.module';

@Module({
  imports: [
    HashModule,
    LoginJwtModule,
    SocialLoginJwtModule,
    UtilModule,
    UserCoreModule,
    ConfigModule.forFeature(kakaoLoginConfig),
    ConfigModule.forFeature(naverLoginConfig),
    ConfigModule.forFeature(appleLoginConfig),
    JwtModule.register({}),
    HttpModule.registerAsync({
      imports: [ConfigModule.forFeature(httpConfig)],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    KakaoLoginStrategy,
    NaverLoginStrategy,
    AppleLoginStrategy,
  ],
})
export class AuthModule {}

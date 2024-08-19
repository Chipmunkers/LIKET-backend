import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
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

@Module({
  imports: [
    HashModule,
    PrismaModule,
    UserModule,
    LoginJwtModule,
    SocialLoginJwtModule,
    UtilModule,
    ConfigModule.forFeature(kakaoLoginConfig),
    ConfigModule.forFeature(naverLoginConfig),
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
  providers: [AuthService, KakaoLoginStrategy, NaverLoginStrategy],
})
export class AuthModule {}

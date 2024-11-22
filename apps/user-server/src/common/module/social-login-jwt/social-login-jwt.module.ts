import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SocialLoginJwtService } from './social-login-jwt.service';
import socialLoginJwtConfig from './config/social-login-jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(socialLoginJwtConfig)],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('socialLoginJwt'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [SocialLoginJwtService],
  exports: [SocialLoginJwtService],
})
export class SocialLoginJwtModule {}

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginJwtService } from './login-jwt.service';
import loginJwtConfig from './config/login-jwt.config';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(loginJwtConfig)],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('loginJwt'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [LoginJwtService],
  exports: [LoginJwtService],
})
export class LoginJwtModule {}

import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginJwtService } from './login-jwt.service';
import loginJwtConfig from './config/login-jwt.config';
import { LoginJwtRepository } from './login-jwt.repository';
import { UtilModule } from '../util/util.module';
import { PrismaModule } from 'libs/modules';

@Global()
@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(loginJwtConfig)],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('loginJwt'),
      }),
      inject: [ConfigService],
    }),
    UtilModule,
  ],
  providers: [LoginJwtService, LoginJwtRepository],
  exports: [LoginJwtService],
})
export class LoginJwtModule {}

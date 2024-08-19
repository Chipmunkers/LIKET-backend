import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginJwtService } from './login-jwt.service';
import loginJwtConfig from './config/login-jwt.config';
import { PrismaModule } from '../prisma/prisma.module';
import { LoginJwtRepository } from './login-jwt.repository';
import { UtilService } from '../util/util.service';
import { UtilModule } from '../util/util.module';

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

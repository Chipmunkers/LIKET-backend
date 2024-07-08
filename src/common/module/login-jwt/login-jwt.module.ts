import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LoginJwtService } from './login-jwt.service';
import loginJwtConfig from './config/login-jwt.config';
import { PrismaModule } from '../prisma/prisma.module';
import { LoginJwtRepository } from './login-jwt.repository';

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
  ],
  providers: [LoginJwtService, LoginJwtRepository],
  exports: [LoginJwtService],
})
export class LoginJwtModule {}

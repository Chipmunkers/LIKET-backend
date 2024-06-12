import { Global, Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashModule } from '../../common/module/hash/hash.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { LoginJwtService } from './login-jwt.service';

@Global()
@Module({
  imports: [
    HashModule,
    PrismaModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('jwt'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LoginJwtService],
  exports: [LoginJwtService],
})
export class AuthModule {}

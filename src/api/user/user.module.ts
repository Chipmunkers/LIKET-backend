import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '../../common/module/hash/hash.service';
import { UploadModule } from '../upload/upload.module';
import { HashModule } from '../../common/module/hash/hash.module';
import { EmailCertModule } from '../email-cert/email-cert.module';
import { SocialLoginUserService } from './social-login-user.service';
import { LoginJwtModule } from '../../common/module/login-jwt/login-jwt.module';
import { SocialLoginJwtModule } from '../../common/module/social-login-jwt/social-login-jwt.module';
import { UserPwService } from './user-pw.service';

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    HashModule,
    EmailCertModule,
    LoginJwtModule,
    SocialLoginJwtModule,
  ],
  controllers: [UserController],
  providers: [UserService, SocialLoginUserService, UserPwService],
  exports: [SocialLoginUserService],
})
export class UserModule {}

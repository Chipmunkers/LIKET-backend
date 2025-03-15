import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UploadModule } from '../upload/upload.module';
import { EmailCertModule } from '../email-cert/email-cert.module';
import { SocialLoginUserService } from './social-login-user.service';
import { LoginJwtModule } from '../../common/module/login-jwt/login-jwt.module';
import { SocialLoginJwtModule } from '../../common/module/social-login-jwt/social-login-jwt.module';
import { UserPwService } from './user-pw.service';
import { LiketRepository } from '../liket/liket.repository';
import { PrismaModule } from 'libs/modules';
import { UserCoreModule } from 'libs/core/user/user-core.module';
import { ReviewCoreModule } from 'libs/core/review/review-core.module';
import { HashModule } from 'libs/modules/hash/hash.module';

@Module({
  imports: [
    PrismaModule,
    UploadModule,
    HashModule,
    EmailCertModule,
    LoginJwtModule,
    SocialLoginJwtModule,
    UserCoreModule,
    ReviewCoreModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    SocialLoginUserService,
    UserPwService,
    LiketRepository,
  ],
  exports: [SocialLoginUserService],
})
export class UserModule {}

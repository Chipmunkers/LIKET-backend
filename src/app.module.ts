import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { BannerModule } from './api/banner/banner.module';
import { CultureContentModule } from './api/culture-content/culture-content.module';
import { InquiryModule } from './api/inquiry/inquiry.module';
import { LiketModule } from './api/liket/liket.module';
import { ReviewModule } from './api/review/review.module';
import { TosModule } from './api/tos/tos.module';
import { UploadModule } from './api/upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './common/module/logger/logger.module';
import modeConfig from './common/config/mode.config';
import { ContentTagModule } from './api/content-tag/content-tag.module';
import { EmailCertModule } from './api/email-cert/email-cert.module';
import { VerifyLoginJwtMiddleware } from './common/middleware/verify-login-jwt.middleware';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [modeConfig],
    }),
    EmailCertModule,
    UserModule,
    AuthModule,
    BannerModule,
    CultureContentModule,
    InquiryModule,
    LiketModule,
    ReviewModule,
    TosModule,
    UploadModule,
    ContentTagModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(VerifyLoginJwtMiddleware).forRoutes('/');
  }
}

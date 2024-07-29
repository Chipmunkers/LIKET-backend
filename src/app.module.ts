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
import { LoginJwtModule } from './common/module/login-jwt/login-jwt.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './common/module/prisma/prisma.module';
import { MetricModule } from './api/metric/metric.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 5 * 1000,
        limit: 50,
      },
    ]),
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [modeConfig],
    }),
    PrismaModule,
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
    LoginJwtModule,
    MetricModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(VerifyLoginJwtMiddleware).forRoutes('/');
  }
}

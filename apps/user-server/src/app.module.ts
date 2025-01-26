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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from './common/module/logger/logger.module';
import modeConfig from './common/config/mode.config';
import { ContentTagModule } from './api/content-tag/content-tag.module';
import { EmailCertModule } from './api/email-cert/email-cert.module';
import { VerifyLoginJwtMiddleware } from './common/middleware/verify-login-jwt.middleware';
import { LoginJwtModule } from './common/module/login-jwt/login-jwt.module';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { MetricModule } from './api/metric/metric.module';
import { MapModule } from './api/map/map.module';
import { AppController } from './app.controller';
import { ReviewReportModule } from './api/review-report/review-report.module';
import { NoticeModule } from './api/notice/notice.module';
import { UnknownExceptionFilter } from 'apps/user-server/src/common/filter/unknown-exception.filter';
import { DiscordModule } from 'libs/modules/discord/discord.module';
import { AddressModule } from 'apps/user-server/src/api/address/address.module';
import { PrismaProvider } from 'libs/modules';
import { UserInterestModule } from 'apps/user-server/src/api/user-interest/user-interest.module';

@Module({
  imports: [
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule.forFeature(modeConfig)],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => {
        if (configService.get('mode') === 'test') {
          return [];
        }

        return [
          {
            ttl: 5 * 1000,
            limit: 50,
          },
        ];
      },
      inject: [ConfigService],
    }),
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [modeConfig],
    }),
    MapModule,
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
    ReviewReportModule,
    NoticeModule,
    DiscordModule,
    AddressModule,
    UserInterestModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: UnknownExceptionFilter,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    return consumer.apply(VerifyLoginJwtMiddleware).forRoutes('/');
  }
}

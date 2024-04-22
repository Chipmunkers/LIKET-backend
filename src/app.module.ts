import { Module } from '@nestjs/common';
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
import emailConfig from './common/config/email.config';
import redisConfig from './common/config/redis.config';
import jwtConfig from './common/config/jwt.config';
import { MailerModule } from '@nestjs-modules/mailer';
import { LoggerModule } from './logger/logger.module';
import s3Config from './common/config/s3.config';
import modeConfig from './common/config/mode.config';

@Module({
  imports: [
    LoggerModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [emailConfig, redisConfig, jwtConfig, s3Config, modeConfig],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('email'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    BannerModule,
    CultureContentModule,
    InquiryModule,
    LiketModule,
    ReviewModule,
    TosModule,
    UploadModule,
  ],
})
export class AppModule {}

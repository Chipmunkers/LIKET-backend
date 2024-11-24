import { Module } from '@nestjs/common';
import { AuthModule } from './api/auth/auth.module';
import { UploadModule } from './common/upload/upload.module';
import { BannerMoudle } from './api/banner/banner.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { TokenModule } from './common/token/token.module';
import { UserModule } from './api/user/user.module';
import { CultureContentModule } from './api/culture-content/culture-content.module';
import { ReviewModule } from './api/review/review.module';
import { UserHistoryModule } from './api/user-history/user-history.module';
import { LiketModule } from './api/liket/liket.module';
import { TosModule } from './api/tos/tos.module';
import { InquiryModule } from './api/inquiry/inquiry.module';
import { ReviewReportModule } from './api/review-report/review-report.module';
import { NoticeModule } from './api/notice/notice.module';

@Module({
  imports: [
    PrismaModule,
    TokenModule,
    AuthModule,
    UploadModule,
    BannerMoudle,
    UserModule,
    CultureContentModule,
    ReviewModule,
    UserHistoryModule,
    LiketModule,
    TosModule,
    InquiryModule,
    ReviewReportModule,
    NoticeModule,
  ],
})
export class AppModule {}

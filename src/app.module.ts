import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { BannerModule } from './api/banner/banner.module';
import { CultureContentModule } from './api/culture-content/culture-content.module';
import { InquiryModule } from './api/inquiry/inquiry.module';
import { LiketModule } from './api/liket/liket.module';
import { ReveiwModule } from './api/reveiw/reveiw.module';
import { RouteModule } from './api/route/route.module';
import { TosModule } from './api/tos/tos.module';
import { UploadModule } from './api/upload/upload.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    BannerModule,
    CultureContentModule,
    InquiryModule,
    LiketModule,
    ReveiwModule,
    RouteModule,
    TosModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

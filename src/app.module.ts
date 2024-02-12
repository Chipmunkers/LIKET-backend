import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { BannerModule } from './banner/banner.module';
import { CultureContentModule } from './culture-content/culture-content.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { LiketModule } from './liket/liket.module';
import { ReveiwModule } from './reveiw/reveiw.module';
import { RouteModule } from './route/route.module';
import { TosModule } from './tos/tos.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [UserModule, AuthModule, BannerModule, CultureContentModule, InquiryModule, LiketModule, ReveiwModule, RouteModule, TosModule, UploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

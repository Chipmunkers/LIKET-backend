import { Module } from '@nestjs/common';
import { CultureContentService } from './culture-content.service';
import { CultureContentController } from './culture-content.controller';
import {
  InstagramModule,
  KakaoAddressModule,
  OpenAIModule,
  PrismaModule,
  S3Module,
} from 'libs/modules';
import { UtilModule } from 'apps/admin-server/src/common/util/util.module';

@Module({
  imports: [
    PrismaModule,
    InstagramModule,
    S3Module,
    UtilModule,
    OpenAIModule,
    KakaoAddressModule,
  ],
  providers: [CultureContentService],
  controllers: [CultureContentController],
})
export class CultureContentModule {}

import { Module } from '@nestjs/common';
import { CultureContentController } from './culture-content.controller';
import { CultureContentService } from './culture-content.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';
import { ContentReviewController } from './content-review.controller';
import { ReveiwModule } from '../review/reveiw.module';

@Module({
  imports: [PrismaModule, ReveiwModule],
  controllers: [
    CultureContentController,
    TagController,
    ContentReviewController,
  ],
  providers: [CultureContentService, TagService],
})
export class CultureContentModule {}

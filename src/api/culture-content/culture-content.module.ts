import { Module } from '@nestjs/common';
import { CultureContentController } from './culture-content.controller';
import { CultureContentService } from './culture-content.service';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { ContentAuthService } from './content-auth.service';
import { CultureContentRepository } from './culture-content.repository';
import { CultureContentLikeRepository } from './culture-content-like.repository';
import { ReviewRepository } from '../review/review.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CultureContentController],
  providers: [
    CultureContentService,
    ContentAuthService,
    CultureContentRepository,
    CultureContentLikeRepository,
    ReviewRepository,
  ],
  exports: [CultureContentRepository],
})
export class CultureContentModule {}

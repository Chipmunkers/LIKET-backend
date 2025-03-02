import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewAuthService } from './review-auth.service';
import { ReviewRepository } from './review.repository';
import { ReviewLikeRepository } from './review-like.repository';
import { CultureContentRepository } from '../culture-content/culture-content.repository';
import { PrismaModule } from 'libs/modules';
import { ReviewCoreModule } from 'libs/core/review/review-core.module';

@Module({
  imports: [PrismaModule, ReviewCoreModule],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    ReviewAuthService,
    ReviewRepository,
    ReviewLikeRepository,
    CultureContentRepository,
  ],
})
export class ReviewModule {}

// TODO: 리뷰 목록 불러오는 기능 잘 되는지 확인하기

import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewAuthService } from './review-auth.service';
import { ReviewRepository } from './review.repository';
import { ReviewLikeRepository } from './review-like.repository';
import { CultureContentRepository } from '../culture-content/culture-content.repository';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
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

import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewAuthService } from './review-auth.service';
import { ReviewCoreModule } from 'libs/core/review/review-core.module';
import { CultureContentCoreModule } from 'libs/core/culture-content/culture-content-core.module';

@Module({
  imports: [ReviewCoreModule, CultureContentCoreModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewAuthService],
})
export class ReviewModule {}

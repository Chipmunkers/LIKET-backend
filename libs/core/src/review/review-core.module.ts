import { Module } from '@nestjs/common';
import { ReviewCoreRepository } from 'libs/core/review/review-core.repository';
import { ReviewCoreService } from 'libs/core/review/review-core.service';

@Module({
  imports: [],
  providers: [ReviewCoreService, ReviewCoreRepository],
  exports: [ReviewCoreRepository],
})
export class ReviewCoreModule {}

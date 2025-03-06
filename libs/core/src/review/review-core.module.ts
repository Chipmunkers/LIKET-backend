import { Module } from '@nestjs/common';
import { ReviewCoreRepository } from 'libs/core/review/review-core.repository';
import { ReviewCoreService } from 'libs/core/review/review-core.service';
import { ReviewLikeCoreRepository } from 'libs/core/review/review-like-core.repository';
import { ReviewLikeCoreService } from 'libs/core/review/review-like-core.service';
import { ReviewReportCoreRepository } from 'libs/core/review/review-report-core.repository';
import { ReviewReportCoreService } from 'libs/core/review/review-report-core.service';

@Module({
  imports: [],
  providers: [
    ReviewCoreService,
    ReviewCoreRepository,
    ReviewLikeCoreService,
    ReviewLikeCoreRepository,
    ReviewReportCoreRepository,
    ReviewReportCoreService,
  ],
  exports: [ReviewCoreService, ReviewLikeCoreService, ReviewReportCoreService],
})
export class ReviewCoreModule {}

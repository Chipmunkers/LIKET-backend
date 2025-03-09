import { Injectable } from '@nestjs/common';
import { ReviewReportCoreRepository } from 'libs/core/review/review-report-core.repository';

@Injectable()
export class ReviewReportCoreService {
  constructor(
    private readonly reviewReportCoreRepository: ReviewReportCoreRepository,
  ) {}
}

import { Module } from '@nestjs/common';
import { ReviewReportService } from './review-report.service';
import { ReviewReportController } from './review-report.controller';
import { ReviewRepository } from '../review/review.repository';
import { UserRepository } from '../user/user.repository';
import { ReviewReportRepository } from './review-report.repository';
import { ReviewReportAuthService } from './review-report-auth.service';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [
    ReviewReportService,
    ReviewRepository,
    UserRepository,
    ReviewReportRepository,
    ReviewReportAuthService,
  ],
  controllers: [ReviewReportController],
})
export class ReviewReportModule {}

import { Module } from '@nestjs/common';
import { ReviewReportService } from './review-report.service';
import { ReviewReportController } from './review-report.controller';
import { PrismaModule } from 'libs/modules';
import { ReviewCoreModule } from 'libs/core/review/review-core.module';

@Module({
  imports: [PrismaModule, ReviewCoreModule],
  providers: [ReviewReportService],
  controllers: [ReviewReportController],
})
export class ReviewReportModule {}

import { Module } from '@nestjs/common';
import { ReviewReportService } from './review-report.service';
import { ReviewReportController } from './review-report.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [ReviewReportService],
  controllers: [ReviewReportController],
})
export class ReviewReportModule {}

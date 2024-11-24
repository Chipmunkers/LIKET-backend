import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';

@Module({
  providers: [InquiryService],
  controllers: [InquiryController],
})
export class InquiryModule {}

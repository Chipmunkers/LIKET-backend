import { Module } from '@nestjs/common';
import { InquiryAnswerCoreRepository } from 'libs/core/inquiry/inquiry-answer-core.repository';
import { InquiryCoreRepository } from 'libs/core/inquiry/inquiry-core.repository';
import { InquiryCoreService } from 'libs/core/inquiry/inquiry-core.service';

@Module({
  imports: [],
  providers: [
    InquiryCoreService,
    InquiryCoreRepository,
    InquiryAnswerCoreRepository,
  ],
  exports: [InquiryCoreService],
})
export class InquiryCoreModule {}

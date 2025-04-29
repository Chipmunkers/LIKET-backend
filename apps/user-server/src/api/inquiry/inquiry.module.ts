import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { InquiryTypeController } from './inquiry-type.controller';
import { InquiryTypeService } from './inquiry-type.service';
import { InquiryCoreModule } from 'libs/core/inquiry/inquiry-core.module';

@Module({
  imports: [InquiryCoreModule],
  providers: [InquiryService, InquiryTypeService],
  controllers: [InquiryController, InquiryTypeController],
})
export class InquiryModule {}

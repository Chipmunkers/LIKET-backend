import { Module } from '@nestjs/common';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { InquiryTypeController } from './inquiry-type.controller';
import { InquiryTypeService } from './inquiry-type.service';
import { InquiryTypeRepository } from './inquiry-type.repository';
import { InquiryRepository } from './inquiry.repository';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [
    InquiryService,
    InquiryTypeService,
    InquiryTypeRepository,
    InquiryRepository,
  ],
  controllers: [InquiryController, InquiryTypeController],
})
export class InquiryModule {}

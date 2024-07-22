import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { InquiryTypeController } from './inquiry-type.controller';
import { InquiryTypeService } from './inquiry-type.service';
import { InquiryTypeRepository } from './inquiry-type.repository';
import { InquiryRepository } from './inquiry.repository';

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

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { InquiryTypeController } from './inquiry-type.controller';
import { InquiryTypeService } from './inquiry-type.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  providers: [InquiryService, InquiryTypeService],
  controllers: [InquiryController, InquiryTypeController],
})
export class InquiryModule {}

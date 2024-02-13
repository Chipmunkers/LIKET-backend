import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';

@Module({
  imports: [PrismaModule],
  providers: [InquiryService],
  controllers: [InquiryController],
})
export class InquiryModule {}

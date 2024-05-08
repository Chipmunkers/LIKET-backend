import { Module } from '@nestjs/common';
import { CultureContentController } from './culture-content.controller';
import { CultureContentService } from './culture-content.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReviewModule } from '../review/review.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, ReviewModule, UploadModule],
  controllers: [CultureContentController],
  providers: [CultureContentService],
  exports: [CultureContentService],
})
export class CultureContentModule {}

import { Module } from '@nestjs/common';
import { CultureContentController } from './culture-content.controller';
import { CultureContentService } from './culture-content.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { TagService } from './tag.service';

@Module({
  imports: [PrismaModule],
  controllers: [CultureContentController],
  providers: [CultureContentService, TagService],
})
export class CultureContentModule {}

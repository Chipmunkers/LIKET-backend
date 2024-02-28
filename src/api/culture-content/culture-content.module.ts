import { Module } from '@nestjs/common';
import { CultureContentController } from './culture-content.controller';
import { CultureContentService } from './culture-content.service';
import { PrismaModule } from '../../common/prisma/prisma.module';
import { TagService } from './tag.service';
import { TagController } from './tag.controller';

@Module({
  imports: [PrismaModule],
  controllers: [CultureContentController, TagController],
  providers: [CultureContentService, TagService],
})
export class CultureContentModule {}

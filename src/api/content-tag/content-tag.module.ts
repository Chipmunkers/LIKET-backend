import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { ContentTagService } from './content-tag.service';
import { ContentTagController } from './content-tag.controller';
import { ContentTagRepository } from './content-tag.repository';

@Module({
  imports: [PrismaModule],
  providers: [ContentTagService, ContentTagRepository],
  controllers: [ContentTagController],
})
export class ContentTagModule {}

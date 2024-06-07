import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { ContentTagService } from './content-tag.service';
import { ContentTagController } from './content-tag.controller';

@Module({
  imports: [PrismaModule],
  providers: [ContentTagService],
  controllers: [ContentTagController],
})
export class ContentTagModule {}

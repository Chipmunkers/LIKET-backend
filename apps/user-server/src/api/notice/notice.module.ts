import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeRepository } from './notice.repository';
import { NoticeController } from './notice.controller';
import { PrismaModule } from '../../common/module/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [NoticeService, NoticeRepository],
  controllers: [NoticeController],
})
export class NoticeModule {}

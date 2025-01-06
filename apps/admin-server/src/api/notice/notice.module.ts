import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [NoticeService],
  controllers: [NoticeController],
})
export class NoticeModule {}

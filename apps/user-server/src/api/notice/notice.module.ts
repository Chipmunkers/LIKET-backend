import { Module } from '@nestjs/common';
import { NoticeService } from './notice.service';
import { NoticeController } from './notice.controller';
import { NoticeCoreModule } from 'libs/core/notice/notice-core.module';

@Module({
  imports: [NoticeCoreModule],
  providers: [NoticeService],
  controllers: [NoticeController],
})
export class NoticeModule {}

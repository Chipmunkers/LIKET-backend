import { Module } from '@nestjs/common';
import { NoticeCoreRepository } from 'libs/core/notice/notice-core.repository';
import { NoticeCoreService } from 'libs/core/notice/notice-core.service';

@Module({
  imports: [],
  providers: [NoticeCoreService, NoticeCoreRepository],
  exports: [NoticeCoreService],
})
export class NoticeCoreModule {}

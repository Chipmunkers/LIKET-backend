import { Module } from '@nestjs/common';
import { LiketCoreRepository } from 'libs/core/liket/liket-core.repository';
import { LiketCoreService } from 'libs/core/liket/liket-core.service';

@Module({
  imports: [],
  providers: [LiketCoreService, LiketCoreRepository],
  exports: [LiketCoreService],
})
export class LiketCoreModule {}

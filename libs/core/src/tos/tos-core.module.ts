import { Module } from '@nestjs/common';
import { TosCoreRepository } from 'libs/core/tos/tos-core.repository';
import { TosCoreService } from 'libs/core/tos/tos-core.service';

@Module({
  imports: [],
  providers: [TosCoreService, TosCoreRepository],
  exports: [TosCoreService],
})
export class TosCoreModule {}

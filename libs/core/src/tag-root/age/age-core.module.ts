import { Module } from '@nestjs/common';
import { AgeCoreRepository } from 'libs/core/tag-root/age/age-core.repository';
import { AgeCoreService } from 'libs/core/tag-root/age/age-core.service';

@Module({
  imports: [],
  providers: [AgeCoreService, AgeCoreRepository],
  exports: [AgeCoreService],
})
export class AgeCoreModule {}

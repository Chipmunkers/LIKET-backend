import { Module } from '@nestjs/common';
import { CultureContentCoreRepository } from 'libs/core/culture-content/culture-content-core.repository';
import { CultureContentCoreService } from 'libs/core/culture-content/culture-content-core.service';

@Module({
  imports: [],
  providers: [CultureContentCoreService, CultureContentCoreRepository],
  exports: [CultureContentCoreService],
})
export class CultureContentCoreModule {}

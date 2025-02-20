import { Module } from '@nestjs/common';
import { CultureContentCoreRepository } from 'libs/core/culture-content/culture-content-core.repository';
import { CultureContentCoreService } from 'libs/core/culture-content/culture-content-core.service';
import { CultureContentLikeCoreRepository } from 'libs/core/culture-content/culture-content-like-core.repository';
import { CultureContentLikeCoreService } from 'libs/core/culture-content/culture-content-like-core.service';

@Module({
  imports: [],
  providers: [
    CultureContentCoreService,
    CultureContentCoreRepository,
    CultureContentLikeCoreRepository,
    CultureContentLikeCoreService,
  ],
  exports: [CultureContentCoreService, CultureContentLikeCoreService],
})
export class CultureContentCoreModule {}

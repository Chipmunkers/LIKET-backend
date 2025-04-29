import { Module } from '@nestjs/common';
import { BannerCoreRepository } from 'libs/core/banner/banner-core.repository';
import { BannerCoreService } from 'libs/core/banner/banner-core.service';

@Module({
  imports: [],
  providers: [BannerCoreService, BannerCoreRepository],
  exports: [BannerCoreService],
})
export class BannerCoreModule {}

import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaModule } from 'libs/modules';
import { BannerCoreModule } from 'libs/core/banner/banner-core.module';

@Module({
  imports: [PrismaModule, BannerCoreModule],
  providers: [BannerService],
  controllers: [BannerController],
})
export class BannerModule {}

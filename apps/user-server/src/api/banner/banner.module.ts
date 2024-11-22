import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { BannerRepository } from './banner.repository';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [BannerService, BannerRepository],
  controllers: [BannerController],
})
export class BannerModule {}

import { Module } from '@nestjs/common';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  controllers: [BannerController],
  providers: [BannerService],
})
export class BannerModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { BannerRepository } from './banner.repository';

@Module({
  imports: [PrismaModule],
  providers: [BannerService, BannerRepository],
  controllers: [BannerController],
})
export class BannerModule {}

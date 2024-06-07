import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';

@Module({
  imports: [PrismaModule],
  providers: [BannerService],
  controllers: [BannerController],
})
export class BannerModule {}

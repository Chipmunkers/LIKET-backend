import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { BannerService } from './banner.service';
import { BannerController } from './banner.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  providers: [BannerService],
  controllers: [BannerController],
})
export class BannerModule {}

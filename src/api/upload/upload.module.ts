import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UtilModule } from '../../common/module/util/util.module';

@Module({
  imports: [PrismaModule, ConfigModule, UtilModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UtilModule } from '../../common/module/util/util.module';
import s3Config from './config/s3.config';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule, ConfigModule.forFeature(s3Config), UtilModule],
  controllers: [UploadController],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}

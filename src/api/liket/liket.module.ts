import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { LiketService } from './liket.service';
import { LiketController } from './liket.controller';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [PrismaModule, UploadModule],
  controllers: [LiketController],
  providers: [LiketService],
})
export class LiketModule {}

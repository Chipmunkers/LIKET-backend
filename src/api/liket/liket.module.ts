import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/module/prisma/prisma.module';
import { LiketService } from './liket.service';
import { LiketController } from './liket.controller';
import { UploadModule } from '../upload/upload.module';
import { LiketAuthService } from './liket-auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [LiketController],
  providers: [LiketService, LiketAuthService],
})
export class LiketModule {}

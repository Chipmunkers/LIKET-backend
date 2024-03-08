import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { LiketService } from './liket.service';
import { LiketController } from './liket.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LiketController],
  providers: [LiketService],
})
export class LiketModule {}

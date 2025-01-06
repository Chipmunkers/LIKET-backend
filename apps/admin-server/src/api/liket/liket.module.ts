import { Module } from '@nestjs/common';
import { LiketService } from './liket.service';
import { LiketController } from './liket.controller';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [LiketService],
  controllers: [LiketController],
})
export class LiketModule {}

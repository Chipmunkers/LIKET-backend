import { Module } from '@nestjs/common';
import { LiketService } from './liket.service';
import { LiketController } from './liket.controller';

@Module({
  providers: [LiketService],
  controllers: [LiketController],
})
export class LiketModule {}

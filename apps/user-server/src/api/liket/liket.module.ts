import { Module } from '@nestjs/common';
import { LiketService } from './liket.service';
import { LiketController } from './liket.controller';
import { LiketAuthService } from './liket-auth.service';
import { LiketRepository } from './liket.repository';
import { ReviewRepository } from '../review/review.repository';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  controllers: [LiketController],
  providers: [
    LiketService,
    LiketAuthService,
    LiketRepository,
    ReviewRepository,
  ],
})
export class LiketModule {}

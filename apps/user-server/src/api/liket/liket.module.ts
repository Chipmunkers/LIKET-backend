import { Module } from '@nestjs/common';
import { LiketService } from './liket.service';
import { LiketController } from './liket.controller';
import { LiketAuthService } from './liket-auth.service';
import { LiketRepository } from './liket.repository';
import { ReviewRepository } from '../review/review.repository';
import { PrismaModule } from 'libs/modules';
import { LiketCoreModule } from 'libs/core/liket/liket-core.module';
import { ReviewCoreModule } from 'libs/core/review/review-core.module';

@Module({
  imports: [PrismaModule, LiketCoreModule, ReviewCoreModule],
  controllers: [LiketController],
  providers: [
    LiketService,
    LiketAuthService,
    LiketRepository,
    ReviewRepository,
  ],
})
export class LiketModule {}

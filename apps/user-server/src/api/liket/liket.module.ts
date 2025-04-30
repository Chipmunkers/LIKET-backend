import { Module } from '@nestjs/common';
import { LiketService } from './liket.service';
import { LiketController } from './liket.controller';
import { LiketAuthService } from './liket-auth.service';
import { LiketCoreModule } from 'libs/core/liket/liket-core.module';
import { ReviewCoreModule } from 'libs/core/review/review-core.module';

@Module({
  imports: [LiketCoreModule, ReviewCoreModule],
  controllers: [LiketController],
  providers: [LiketService, LiketAuthService],
})
export class LiketModule {}

import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewAuthService } from './review-auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewAuthService],
  exports: [ReviewService],
})
export class ReviewModule {}

import { Module } from '@nestjs/common';
import { UserInterestController } from 'apps/user-server/src/api/user-interest/user-interest.controller';
import { UserInterestRepository } from 'apps/user-server/src/api/user-interest/user-interest.repository';
import { UserInterestService } from 'apps/user-server/src/api/user-interest/user-interest.service';
import { PrismaModule } from 'libs/modules';

@Module({
  imports: [PrismaModule],
  providers: [UserInterestService, UserInterestRepository],
  controllers: [UserInterestController],
  exports: [],
})
export class UserInterestModule {}

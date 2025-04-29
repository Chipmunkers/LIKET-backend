import { Module } from '@nestjs/common';
import { UserCoreRepository } from 'libs/core/user/user-core.repository';
import { UserCoreService } from 'libs/core/user/user-core.service';
import { HashModule } from 'libs/modules/hash/hash.module';
import { WithdrawalReasonCoreModule } from 'libs/core/withdrawal-reason/withdrawal-reason-core.module';
import { UserInterestCoreService } from 'libs/core/user/user-interest.service';
import { UserInterestCoreRepository } from 'libs/core/user/user-interest.repository';

@Module({
  imports: [HashModule, WithdrawalReasonCoreModule],
  providers: [
    UserCoreService,
    UserCoreRepository,
    UserInterestCoreService,
    UserInterestCoreRepository,
  ],
  exports: [UserCoreService],
})
export class UserCoreModule {}

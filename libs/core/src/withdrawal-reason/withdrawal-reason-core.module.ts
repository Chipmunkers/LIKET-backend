import { Module } from '@nestjs/common';
import { WithdrawalReasonCoreRepository } from 'libs/core/withdrawal-reason/withdrawal-reason-core.repository';
import { WithdrawalReasonCoreService } from 'libs/core/withdrawal-reason/withdrawal-reason.service';

@Module({
  imports: [],
  providers: [WithdrawalReasonCoreService, WithdrawalReasonCoreRepository],
  exports: [WithdrawalReasonCoreService],
})
export class WithdrawalReasonCoreModule {}

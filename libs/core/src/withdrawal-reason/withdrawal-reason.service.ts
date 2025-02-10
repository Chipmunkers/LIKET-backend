import { Injectable } from '@nestjs/common';
import { CreateWithdrawalReasonInput } from 'libs/core/withdrawal-reason/input/create-withdrawal.input';
import { WithdrawalReasonModel } from 'libs/core/withdrawal-reason/model/withdrawal-reason.model';
import { WithdrawalReasonCoreRepository } from 'libs/core/withdrawal-reason/withdrawal-reason-core.repository';

@Injectable()
export class WithdrawalReasonCoreService {
  constructor(
    private readonly withdrawalReasonCoreRepository: WithdrawalReasonCoreRepository,
  ) {}

  /**
   * 탈퇴 사유를 생성하는 메서드
   *
   * @author jochongs
   *
   * @param idx number
   */
  public async createWithdrawalReason(
    idx: number,
    input: CreateWithdrawalReasonInput,
  ): Promise<WithdrawalReasonModel> {
    // TODO: F key 에러 발생할 때 에러 던져줘야함.
    return WithdrawalReasonModel.fromPrisma(
      await this.withdrawalReasonCoreRepository.createWithdrawalReason(
        idx,
        input,
      ),
    );
  }
}

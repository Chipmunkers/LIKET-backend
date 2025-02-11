import { Transactional } from '@nestjs-cls/transactional';
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
   * ! 주의: UserCoreService.withdrawalUserByIdx 메서드 사용을 권장합니다.
   *
   * @author jochongs
   *
   * @param idx number
   */
  @Transactional()
  public async createWithdrawalReason(
    idx: number,
    input: CreateWithdrawalReasonInput,
  ): Promise<WithdrawalReasonModel> {
    return WithdrawalReasonModel.fromPrisma(
      await this.withdrawalReasonCoreRepository.createWithdrawalReason(
        idx,
        input,
      ),
    );
  }
}

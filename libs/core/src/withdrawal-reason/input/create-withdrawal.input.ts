import { PickType } from '@nestjs/swagger';
import { WithdrawalReasonType } from 'libs/core/withdrawal-reason/constant/withdrawal-reason-type';
import { WithdrawalReasonModel } from 'libs/core/withdrawal-reason/model/withdrawal-reason.model';

/**
 * @author jochongs
 */
export class CreateWithdrawalReasonInput extends PickType(
  WithdrawalReasonModel,
  ['contents'],
) {
  public readonly typeIdx: WithdrawalReasonType;
}

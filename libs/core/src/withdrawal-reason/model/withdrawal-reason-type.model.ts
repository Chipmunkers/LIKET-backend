import { DeleteReasonTypeSelectField } from 'libs/core/withdrawal-reason/model/prisma/delete-reason-type-select-field';

/**
 * @author jochongs
 */
export class WithdrawalReasonTypeModel {
  /**
   * 탈퇴 사유 타입 식별자
   *
   * @example 12
   */
  public readonly idx: number;

  /**
   * 탈퇴 사유 타입명
   */
  public readonly name: string;

  constructor(data: WithdrawalReasonTypeModel) {
    Object.assign(this, data);
  }

  public static fromPrisma(
    type: DeleteReasonTypeSelectField,
  ): WithdrawalReasonTypeModel {
    return new WithdrawalReasonTypeModel({
      idx: type.idx,
      name: type.name,
    });
  }
}

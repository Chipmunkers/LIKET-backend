import { PickType } from '@nestjs/swagger';
import { UserModel } from 'libs/core/user/model/user.model';
import { DeleteReasonSelectField } from 'libs/core/withdrawal-reason/model/prisma/delete-reason-select-field';
import { WithdrawalReasonTypeModel } from 'libs/core/withdrawal-reason/model/withdrawal-reason-type.model';

/**
 * @author jochongs
 */
export class WithdrawalReasonModel extends PickType(UserModel, [
  'email',
  'profileImgPath',
  'nickname',
  'createdAt',
]) {
  /**
   * 탈퇴한 사용자 인덱스
   *
   * @example 1
   */
  public readonly idx: number;

  /**
   * 탈퇴 유형
   */
  public readonly type: WithdrawalReasonTypeModel;

  /**
   * 탈퇴 사유
   */
  public readonly contents: string | null;

  constructor(data: WithdrawalReasonModel) {
    super();
    Object.assign(this, data);
  }

  public static fromPrisma(
    reason: DeleteReasonSelectField,
  ): WithdrawalReasonModel {
    return new WithdrawalReasonModel({
      idx: reason.idx,
      type: WithdrawalReasonTypeModel.fromPrisma(reason.DeleteUserType),
      email: reason.User.email,
      profileImgPath: reason.User.profileImgPath,
      nickname: reason.User.nickname,
      createdAt: reason.User.createdAt,
      contents: reason.contents,
    });
  }
}

import { DeleteUserType } from '@prisma/client';

export class DeleteUserTypeEntity {
  /**
   * 탈퇴 사유 인덱스
   *
   * @example 2
   */
  public idx: number;

  /**
   * 탈퇴 사유 이름
   *
   * @example "다른 계정이 있거나, 재가입 할거에요."
   */
  public name: string;

  private constructor(data: DeleteUserTypeEntity) {
    Object.assign(this, data);
  }

  static createEntity(type: DeleteUserType) {
    return new DeleteUserTypeEntity({
      idx: type.idx,
      name: type.name,
    });
  }
}

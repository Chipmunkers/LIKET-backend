import { DeleteUserReason, Prisma } from '@prisma/client';
import { DeleteUserTypeEntity } from './delete-type.entity';

const reasonWithInclude = Prisma.validator<Prisma.User$DeleteUserReasonArgs>()({
  include: {
    DeleteUserType: true,
  },
});
type ReasonWithInclude = Prisma.DeleteUserReasonGetPayload<typeof reasonWithInclude>;

export class DeleteReasonEntity {
  /**
   * 사용자 인덱스
   *
   * @example 12
   */
  public idx: number;

  /**
   * 탈퇴 사유 유형
   */
  public reasonType: DeleteUserTypeEntity;

  /**
   * 탈퇴 사유
   *
   * @example "평소 바빠서 문화생활을 즐길 여유가 없음"
   */
  public contents: string | null;

  /**
   * 탈퇴 일
   *
   * @example 2024-04-10T10:10:11.000Z
   */
  public createdAt: Date;

  private constructor(data: DeleteReasonEntity) {
    Object.assign(this, data);
  }

  static createEntity(reason: ReasonWithInclude) {
    return new DeleteReasonEntity({
      idx: reason.idx,
      reasonType: DeleteUserTypeEntity.createEntity(reason.DeleteUserType),
      contents: reason.contents || null,
      createdAt: reason.createdAt,
    });
  }
}

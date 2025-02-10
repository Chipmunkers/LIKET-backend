/**
 * 사용자의 수정할 정보
 *
 * null - 빈 값으로 변경
 * undefined - 변경하지 않음
 *
 * @author jochongs
 */
export class UpdateUserInput {
  public readonly nickname?: string;
  public readonly pw?: string;
  public readonly email?: string;
  public readonly gender?: number | null;
  public readonly birth?: number | null;
  public readonly profileImgPath?: string | null;
  public readonly isAdmin?: boolean;
  public readonly blockedAt?: Date | null;
}

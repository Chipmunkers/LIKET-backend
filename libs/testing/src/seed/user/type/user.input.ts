/**
 * @author jochongs
 */
export type UserInput = {
  email: string;

  /**
   * @default false
   */
  isAdmin?: boolean;

  pw?: string;

  nickname?: string;

  /**
   * @default 0
   */
  reportCount?: number;

  /**
   * @default null
   */
  gender?: number | null;

  /**
   * @default null
   */
  birth?: number | null;

  /**
   * @default null
   */
  snsId?: string | null;

  /**
   * @default "local"
   */
  provider?: string;

  /**
   * @default null
   */
  profileImgPath?: string | null;

  /**
   * @default null
   */
  loginAt?: Date | null;

  /**
   * @default null
   */
  deletedAt?: Date | null;

  /**
   * @default null
   */
  blockedAt?: Date | null;
};

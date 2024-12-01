import { Matches } from 'class-validator';

/**
 * @author jochongs
 */
export class ResetPwDto {
  /**
   * 현재 비밀번호
   *
   * @example aA12341234**
   */
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/)
  currPw: string;

  /**
   * 변경하려는 비밀번호
   *
   * @example 변경하려는비밀번호
   */
  @Matches(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,20}$/)
  resetPw: string;
}

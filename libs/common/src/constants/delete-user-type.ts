/**
 * @author jochongs
 */
export const DELETE_USER_TYPE = {
  /** 앱 사용 불편 */
  APP_INCONVENIENCE: 1,
  /** 사용하지 않는 앱 */
  UNUSED_APP: 2,
  /** 부족한 컨텐츠 */
  LACK_OF_CONTENT: 3,
  /** 타서비스 이용 */
  OTHER_SERVICE: 4,
  /** 다른계정/재가입 */
  OTHER_ACCOUNT: 5,
  /** 기타 */
  ETC: 6,
} as const;

export type DeleteUserType =
  (typeof DELETE_USER_TYPE)[keyof typeof DELETE_USER_TYPE];

export const GENRE = {
  /** 팝업 스토어 */
  POPUP_STORE: 1,
  /** 전시회 */
  EXHIBITION: 2,
  /** 연극 */
  THEATER: 3,
  /** 뮤지컬 */
  MUSICAL: 4,
  /** 콘서트 */
  CONCERT: 5,
  /** 페스티벌 */
  FESTIVAL: 6,
} as const;

export type GENRE = (typeof GENRE)[keyof typeof GENRE];

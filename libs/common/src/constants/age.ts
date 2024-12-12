export const AGE = {
  /** 전체 */
  ALL: 1,
  /** 아이들 */
  CHILDREN: 2,
  /** 10대 */
  TEENS: 3,
  /** 20대 */
  TWENTIES: 4,
  /** 30대 */
  THIRTIES: 5,
  /** 40-50대 */
  FORTIES_FIFTIES: 6,
} as const;

export type AGE = (typeof AGE)[keyof typeof AGE];

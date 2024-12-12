/**
 * @author jochongs
 */
export const STYLE = {
  /** 혼자 */
  ALONE: 1,
  /** 함께 */
  TOGETHER: 2,
  /** 반려동물 */
  PET: 3,
  /** 가족 */
  FAMILY: 4,
  /** 포토존 */
  PHOTO_SPOT: 5,
  /** 체험 */
  EXPERIENCE: 6,
  /** 굿즈 */
  GOODS: 7,
  /** 로맨스 */
  ROMANCE: 8,
  /** 스포츠 */
  SPORTS: 9,
  /** 동양풍 */
  ORIENTAL: 10,
  /** 자연 */
  NATURE: 11,
  /** 만화 */
  CARTOON: 12,
  /** 재미있는 */
  FUN: 13,
  /** 귀여운 */
  CUTE: 14,
  /** 활기찬 */
  LIVELY: 15,
  /** 세련된 */
  ELEGANT: 16,
  /** 힙한 */
  HIP: 17,
  /** 핫한 */
  HOT: 18,
  /** 편안한 */
  RELAXING: 19,
  /** 힐링 */
  HEALING: 20,
  /** 감동 */
  TOUCHING: 21,
  /** 예술적인 */
  ARTISTIC: 22,
  /** 신비로운 */
  MYSTERIOUS: 23,
  /** 공포 */
  HORROR: 24,
  /** 미스터리 */
  MYSTERY: 25,
  /** 추리 */
  DETECTIVE: 26,
  /** 진지한 */
  SERIOUS: 27,
} as const;

export type Style = (typeof STYLE)[keyof typeof STYLE];

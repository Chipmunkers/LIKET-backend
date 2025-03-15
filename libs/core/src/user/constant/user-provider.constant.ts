export const USER_PROVIDER = {
  APPLE: 'apple',
  KAKAO: 'kakao',
  NAVER: 'naver',
  LOCAL: 'local',
} as const;

export type UserProvider = (typeof USER_PROVIDER)[keyof typeof USER_PROVIDER];

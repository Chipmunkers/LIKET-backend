export const USER_PROVIDER = {
  APPLE: 'apple',
  KAKAO: 'kakao',
  LOCAL: 'local',
} as const;

export type UserProvider = (typeof USER_PROVIDER)[keyof typeof USER_PROVIDER];

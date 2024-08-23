import { CookieOptions } from 'express';

export default (maxAge: number = 15 * 24 * 60 * 60 * 1000): CookieOptions => {
  /**
   * 브라우저 정책에 의해서 주석 처리
   *
   * httpOnly와 secure, sameSite 옵션이 배포 모드처럼 되어있지 않을 시 쿠기가 전달이 되지 않음
   */
  // if (process.env.MODE === 'develop') {
  //   return {
  //     httpOnly: false,
  //     secure: false,
  //     sameSite: 'none',
  //     maxAge: 60 * 60 * 1000,
  //     signed: true,
  //   };
  // }

  return {
    httpOnly: true,
    sameSite: 'none',
    secure: true,
    maxAge,
    signed: true,
  };
};

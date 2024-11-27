import { CookieOptions } from 'express';

/**
 * 쿠키 옵션을 반환하는 함수
 *
 * @author jochongs
 *
 * @param maxAge 쿠키 만료 시간 (default 15일)
 */
export default (maxAge: number = 15 * 24 * 60 * 60 * 1000): CookieOptions => ({
  httpOnly: true,
  sameSite: 'none',
  secure: true,
  maxAge,
  signed: true,
});

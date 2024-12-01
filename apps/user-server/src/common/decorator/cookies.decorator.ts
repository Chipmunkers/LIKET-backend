import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * 쿠키를 가져오는 파라미터 데코레이터.
 * 첫 번째 파라미터는 cookie의 key값을 의미합니다.
 * 전달된 key가 없을 경우 전달된 모든 쿠키를 객체 형식으로 담아 전달합니다.
 * key가 없을 경우 해당 데코레이터가 붙은 파라미터의 타입을 유의하십시오.
 * string 타입이라고 적을 수 없습니다.
 *
 * @author jochongs
 *
 * @decorator Parameter
 */
export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return data ? request.signedCookies?.[data] : request.signedCookies;
  },
);

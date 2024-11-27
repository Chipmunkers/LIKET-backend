import { ExecutionContext, createParamDecorator } from '@nestjs/common';

/**
 * 사용자 정보를 가져오는 데코레이터.
 * 해당 데코레이터를 사용하는 것이 반드시 사용자를 가져온다고 보장하는 것이 아닙니다.
 * LoginAuth 메서드 데코레이터를 사용했는지 반드시 확인하십시오.
 *
 * 해당 데코레이터가 붙은 파라미터의 타입은 반드시 `LoginUser`이어야합니다.
 *
 * @author jochongs
 *
 * @decorator Parameter
 */
export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.jwtPayload;
  },
);

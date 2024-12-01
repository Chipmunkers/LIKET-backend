import { UseGuards, applyDecorators } from '@nestjs/common';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

/**
 * 로그인 사용자 검증을 위한 메서드 데코레이터.
 * LoginAuthGuard가 작동되며 가드에서 응답하는 에러 상태코드가 스웨거에 자동으로 작성됩니다.
 * LoginAuth 데코레이터와 401, 418 응답 코드를 설명하는 Exception 데코레이터를 같이 사용할 경우 혼동을 야기할 수 있습니다.
 * 아래 데코레이터를 사용하는 경우 401, 418 응답 코드는 사용하지 않는 것을 강력히 권장합니다.
 *
 * @author jochongs
 *
 * @decorator Method
 */
export const LoginAuth = () => {
  return applyDecorators(
    UseGuards(LoginAuthGuard),
    ApiBearerAuth('token'),
    Exception(401, 'No token or invalid token'),
    Exception(418, 'Suspend user'),
  );
};

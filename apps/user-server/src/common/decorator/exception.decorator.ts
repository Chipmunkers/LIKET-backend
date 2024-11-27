import { applyDecorators, HttpException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

/**
 * 스웨거 명세를 위한 메서드 데코레이터
 * 컨트롤러  레이어에서만 사용하십시오.
 *
 * @author jochongs
 *
 * @decorator Parameter
 *
 * @param status 상태코드, 하나의 메서드에는 중복된 상태코드가 기입되면 안됩니다.
 * @param description 상태코드가 가지는 의미
 * @param Exception Exception클래스, message또는 status 필드 외의 값이 필요한 경우 ExceptionClass를 넣어 명시하십시오.
 */
export const Exception = (
  status: number,
  description: string,
  Exception?: new (...args: any[]) => HttpException,
) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      type: Exception,
    }),
  );
};

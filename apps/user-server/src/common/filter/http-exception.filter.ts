import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * UnknownExceptionFilter를 사용하는 것으로 컨벤션을 바꾸었습니다.
 * 따라서 deprecated 되었습니다.
 * 대신, UnknownExceptionFilter를 사용해서 예외를 처리 하십시오.
 * @author jochongs
 *
 * @deprecated
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const message = exception.message;
    const cause = exception.cause;

    if (process.env.MODE === 'develop') {
      return res.status(status).send(exception);
    }

    res.status(status).send({
      message,
      status,
      ...this.generateResponseBodyFromCause(cause),
    });
  }

  private generateResponseBodyFromCause(cause: unknown): Object {
    if (typeof cause === 'object') {
      return { ...cause };
    }

    return {
      cause,
    };
  }
}

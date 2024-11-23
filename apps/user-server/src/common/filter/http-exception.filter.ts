import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
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

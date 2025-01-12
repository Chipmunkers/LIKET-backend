import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GET_MODE, MODE, Mode } from 'libs/common';
import { SERVER_TYPE } from 'libs/common/constants/server-type';
import { DiscordService } from 'libs/modules/discord/discord.service';

/**
 * @author jochongs
 */
@Catch()
export class UnknownExceptionFilter implements ExceptionFilter {
  private readonly MODE: Mode;

  // TODO: discord에 채팅 형식을 여기서 맞춰줘야하나 싶음
  // TODO: 나중에 따로 분리해야할 듯

  constructor(private readonly discordService: DiscordService) {
    this.MODE = GET_MODE();
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;
      const cause = exception.cause;

      if (this.MODE !== MODE.PRODUCT) {
        return res.status(status).send(exception.getResponse());
      }

      res.status(status).send({
        message,
        status,
        ...this.generateResponseBodyFromCause(cause),
      });
      return;
    }

    if (this.MODE === MODE.PRODUCT) {
      this.handleUnknownError(exception, req);
    }
    res.status(500).send({
      message: 'internal server error',
      status: 500,
    });
  }

  /**
   * 식별되지 않은 에러를 핸들링하는 메서드
   *
   * !주의: 절대 해당 메서드에서 Error가 throw되지 않게 하십시오. 메서드 사용처에서 에러를 catch할 수 없습니다.
   */
  private async handleUnknownError(
    exception: any,
    req: Request,
  ): Promise<void> {
    try {
      await this.discordService.createErrorLog(
        SERVER_TYPE.USER_SERVER,
        '사용자 서버 에러 발생',
        this.formatErrorMessage(exception, req),
        exception,
      );
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * 요청 정보를 기반으로 에러 메시지를 생성
   */
  private formatErrorMessage(exception: any, req: Request): string {
    // Request user 정보 추출
    const user = (req as Express.Request & { user?: number }).user || 'Guest';

    // 요청 정보 구조화
    const requestInfo = `
  **URL**: \`${req.originalUrl || 'N/A'}\`
  **Method**: \`${req.method}\`
  **User**: \`${user}\`
  **Headers**:
  \`\`\`json
${JSON.stringify(req.headers, null, 2)}\`\`\``;

    // 전체 에러 메시지 반환
    return `
  **Error Message**: ${exception.message}
  
  **Request Details**
  ${requestInfo}
  `;
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

import { InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';

export class KakaoCallbackResponseDto {
  code: string;
  error?: string;
  errorDescription?: string;
  state?: string;

  constructor(data: KakaoCallbackResponseDto) {
    Object.assign(this, data);
  }

  static createDto(req: Request) {
    if (!req.query.code) {
      throw new InternalServerErrorException('Unexpected error occurred');
    }

    return new KakaoCallbackResponseDto({
      code: req.query.code as string,
      error: req.query.error as string | undefined,
      errorDescription: req.query.error_description as string | undefined,
      state: req.query.state as string | undefined,
    });
  }
}

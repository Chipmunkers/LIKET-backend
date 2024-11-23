import { Request } from 'express';
import { InternalServerErrorException } from '@nestjs/common';

export class NaverCallbackResponseDto {
  code: string;
  state: string;

  constructor(data: NaverCallbackResponseDto) {
    Object.assign(this, data);
  }

  static createDto(req: Request) {
    if (!req.query.code || !req.query.state) {
      throw new InternalServerErrorException('Unexpected error occurred');
    }

    return new NaverCallbackResponseDto({
      code: req.query.code as string,
      state: req.query.state as string,
    });
  }
}

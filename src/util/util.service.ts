import { Injectable } from '@nestjs/common';
import uuid from 'uuid';

@Injectable()
export class UtilService {
  public getUUID(): string {
    return uuid.v4();
  }

  public randomVerificationCode(): string {
    const length = 6;

    return Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, '0');
  }
}

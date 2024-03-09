import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UtilService {
  public getUUID(): string {
    return uuidv4();
  }

  public randomVerificationCode(): string {
    const length = 6;

    return Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, '0');
  }
}

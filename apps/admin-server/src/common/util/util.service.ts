import { Injectable } from '@nestjs/common';

@Injectable()
export class UtilService {
  generateRandomNumericString: (length: number) => string = (length = 6) => {
    return Math.floor(Math.random() * 10 ** length)
      .toString()
      .padStart(length, '0');
  };
}

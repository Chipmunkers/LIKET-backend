import { Injectable } from '@nestjs/common';

@Injectable()
export class MobileBatchService {
  getHello(): string {
    return 'Hello World!';
  }
}

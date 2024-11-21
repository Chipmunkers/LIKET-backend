import { Controller, Get } from '@nestjs/common';
import { MobileBatchService } from './mobile-batch.service';

@Controller()
export class MobileBatchController {
  constructor(private readonly mobileBatchService: MobileBatchService) {}

  @Get()
  getHello(): string {
    return this.mobileBatchService.getHello();
  }
}

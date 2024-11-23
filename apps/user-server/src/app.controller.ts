import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/health-check')
  healthCheck() {
    return;
  }

  @Get('/test')
  test() {
    return 'success';
  }
}

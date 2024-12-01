import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /**
   * ALB 헬스체크를 위한 API
   *
   * @author jochongs
   */
  @Get('/health-check')
  healthCheck() {
    return;
  }

  @Get('/test')
  test() {
    return 'success';
  }
}

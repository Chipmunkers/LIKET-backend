import { Module } from '@nestjs/common';
import { RetryUtilService } from 'libs/modules/retry-util/retry-util.service';

@Module({
  providers: [RetryUtilService],
  exports: [RetryUtilService],
})
export class RetryUtilModule {}

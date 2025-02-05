import { Injectable } from '@nestjs/common';
import { ExecuteWithRetryOption } from 'libs/modules/retry-util/type/execute-with-retry-option';

@Injectable()
export class RetryUtilService {
  /**
   * 실패할 경우 다시 시도할 메서드.
   *
   * @author jochongs
   */
  public async executeWithRetry(
    retriedFunc: (...args: any[]) => any | Promise<any>,
    { retry = 1 }: ExecuteWithRetryOption,
  ) {
    let currentRetryCount = 0;
    let error = null;

    if (retry < 1) {
      throw new Error('Invalid retry value');
    }

    while (true) {
      if (currentRetryCount >= retry) {
        return error;
      }

      try {
        return await retriedFunc();
      } catch (err) {
        error = err;
      }

      currentRetryCount++;
    }
  }
}

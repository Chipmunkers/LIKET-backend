import { Injectable } from '@nestjs/common';
import { wait } from 'libs/common/utils/wait';
import { ExecuteWithRetryOption } from 'libs/modules/retry-util/type/execute-with-retry-option';

@Injectable()
export class RetryUtilService {
  /**
   * 실패할 경우 다시 시도할 메서드.
   * retry 횟수를 넘어서 에러가 날 경우 마지막 에러를 throw 합니다.
   *
   * @author jochongs
   */
  public async executeWithRetry<T = any>(
    retriedFunc: (...args: any[]) => T,
    option: ExecuteWithRetryOption = {},
  ): Promise<T> {
    const { retry = 1, delay = 0 } = option;
    let currentRetryCount = 0;
    let error = null;

    if (retry < 1) {
      throw new Error('Invalid retry value');
    }

    while (true) {
      if (currentRetryCount >= retry) {
        throw error;
      }

      try {
        return await retriedFunc();
      } catch (err) {
        error = err;
      }

      currentRetryCount++;
      await wait(delay);
    }
  }
}

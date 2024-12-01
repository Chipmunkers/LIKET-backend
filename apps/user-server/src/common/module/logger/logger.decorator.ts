import { Inject } from '@nestjs/common';

export const prefixesForLoggers: string[] = new Array<string>();

/**
 * 로거 객체를 생성하는 프로퍼티 데코레이터
 * prefix는 주입되는 Class의 이름으로 할 것을 권장합니다.
 *
 * @author jochongs
 *
 * @decorator Property
 */
export function Logger(prefix: string = '') {
  if (!prefixesForLoggers.includes(prefix)) {
    prefixesForLoggers.push(prefix);
  }
  return Inject(`LoggerService${prefix}`);
}

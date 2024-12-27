/**
 * Service 키 사용 초과 예외
 *
 * @author jochongs
 */
export class KeyLimitExceedException extends Error {
  constructor(message: string) {
    super(message);
  }
}

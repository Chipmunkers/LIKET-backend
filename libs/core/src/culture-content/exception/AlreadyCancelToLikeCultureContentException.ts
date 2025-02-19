import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyCancelToLikeCultureContentException extends ConflictException {
  /** 컨텐츠 인덱스 */
  public readonly idx: number;

  /** 시도한 사용자 인덱스 */
  public readonly tryUserIdx: number;

  constructor(idx: number, tryUserIdx: number, message?: string) {
    super(message);
    this.idx = idx;
    this.tryUserIdx = tryUserIdx;
  }
}

import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyLikedCultureContentException extends ConflictException {
  /** 컨텐츠 인덱스 */
  public readonly idx: number;

  /** 시도한 사용자 인덱스 */
  private readonly tryUserIdx: number;

  constructor(idx: number, tryUserIdx: number, message?: string) {
    super(message);
    this.idx = idx;
    this.tryUserIdx = tryUserIdx;
  }
}

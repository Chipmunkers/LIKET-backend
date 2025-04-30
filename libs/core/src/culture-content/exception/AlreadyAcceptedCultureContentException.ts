import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AlreadyAcceptedCultureContentException extends ConflictException {
  /** 컨텐츠 인덱스 */
  public readonly idx: number;

  constructor(idx: number, message?: string) {
    super(message);
    this.idx = idx;
  }
}

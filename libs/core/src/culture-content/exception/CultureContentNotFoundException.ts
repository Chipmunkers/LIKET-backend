import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class CultureContentNotFoundException extends NotFoundException {
  /** 시도 했던 컨텐츠 식별자 */
  public readonly idx: number;

  constructor(idx: number, message?: string) {
    super(message);
    this.idx = idx;
  }
}

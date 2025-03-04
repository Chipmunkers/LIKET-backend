import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class ReviewNotFoundException extends NotFoundException {
  public readonly idx: number;

  constructor(idx: number, message?: string) {
    super(message);
    this.idx = idx;
  }
}

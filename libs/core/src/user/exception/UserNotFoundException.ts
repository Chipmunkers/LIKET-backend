import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class UserNotFoundError extends Error {
  public readonly idx: number;

  constructor(idx: number, message: string) {
    super(message);
    this.idx = idx;
  }
}

import { NotFoundException } from '@nestjs/common';

/**
 * @author wherehows
 */
export class LiketNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

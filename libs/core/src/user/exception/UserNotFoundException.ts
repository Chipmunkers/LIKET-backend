import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class UserNotFoundException extends NotFoundException {
  constructor(idx: number, message: string) {
    super(message);
  }
}

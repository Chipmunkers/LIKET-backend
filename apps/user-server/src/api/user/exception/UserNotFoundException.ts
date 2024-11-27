import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class UserNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

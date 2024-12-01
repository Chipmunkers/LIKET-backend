import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class CodeNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

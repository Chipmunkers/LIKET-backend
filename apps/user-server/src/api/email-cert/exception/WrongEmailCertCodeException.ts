import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class WrongEmailCertCodeException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

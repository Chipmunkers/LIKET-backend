import { BadRequestException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class InvalidCurrentPasswordException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}

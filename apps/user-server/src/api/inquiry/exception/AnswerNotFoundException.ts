import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AnswerNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

import { NotFoundException } from '@nestjs/common';

export class AnswerNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

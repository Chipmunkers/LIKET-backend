import { BadRequestException } from '@nestjs/common';

export class InvalidCurrentPasswordException extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}

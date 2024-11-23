import { NotFoundException } from '@nestjs/common';

export class NoticeNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

import { NotFoundException } from '@nestjs/common';

export class FestivalNotFoundException extends NotFoundException {
  constructor(id: string, message: string) {
    super(`${message}, id = ${id}`);
  }
}

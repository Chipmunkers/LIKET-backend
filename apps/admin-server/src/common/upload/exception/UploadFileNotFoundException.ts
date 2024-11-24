import { NotFoundException } from '@nestjs/common';

export class UploadFileNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

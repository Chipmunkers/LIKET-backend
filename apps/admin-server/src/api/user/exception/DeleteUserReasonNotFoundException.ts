import { NotFoundException } from '@nestjs/common';

export class DeleteUserReasonNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

import { ForbiddenException } from '@nestjs/common';

export class PermissionDeniedException extends ForbiddenException {
  constructor(message: string) {
    super(message);
  }
}

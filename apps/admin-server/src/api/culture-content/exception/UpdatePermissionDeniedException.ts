import { ForbiddenException } from '@nestjs/common';

export class UpdatePermissionDeniedException extends ForbiddenException {
  constructor(message: string) {
    super(message);
  }
}

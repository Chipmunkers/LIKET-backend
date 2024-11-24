import { ForbiddenException } from '@nestjs/common';

export class AdminPermissionRequiredException extends ForbiddenException {
  constructor(message: string) {
    super(message);
  }
}

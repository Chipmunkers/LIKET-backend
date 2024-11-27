import { ForbiddenException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class PermissionDeniedException extends ForbiddenException {
  constructor(message: string = 'Permission Denied') {
    super(message);
  }
}

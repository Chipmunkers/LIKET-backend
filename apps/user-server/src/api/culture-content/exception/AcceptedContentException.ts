import { ConflictException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class AcceptedContentException extends ConflictException {
  constructor(message: string) {
    super(message);
  }
}

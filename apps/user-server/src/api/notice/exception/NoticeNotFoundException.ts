import { NotFoundException } from '@nestjs/common';

/**
 * @author jochongs
 */
export class NoticeNotFoundException extends NotFoundException {
  constructor(message: string) {
    super(message);
  }
}

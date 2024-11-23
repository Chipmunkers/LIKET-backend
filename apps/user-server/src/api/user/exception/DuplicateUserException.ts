import { ConflictException } from '@nestjs/common';

export class DuplicateUserException<
  V extends 'nickname' | 'email',
> extends ConflictException {
  constructor(message: string, cause: V) {
    super(message, {
      cause,
    });
  }
}

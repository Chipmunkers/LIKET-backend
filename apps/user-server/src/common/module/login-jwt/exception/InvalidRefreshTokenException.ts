import { UnauthorizedException } from '@nestjs/common';
import { InvalidRefreshTokenType } from './InvalidRefreshTokenType';
import { ApiProperty } from '@nestjs/swagger';

/**
 * @author jochongs
 */
export class InvalidRefreshTokenException extends UnauthorizedException {
  @ApiProperty({ enum: InvalidRefreshTokenType })
  type: InvalidRefreshTokenType;

  constructor(message: string, type: InvalidRefreshTokenType) {
    super(message, { cause: { type } });
  }
}

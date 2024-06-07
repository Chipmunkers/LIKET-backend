import { UseGuards, applyDecorators } from '@nestjs/common';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuthGuard } from './auth.guard';

export const LoginAuth = () => {
  return applyDecorators(
    UseGuards(LoginAuthGuard),
    Exception(401, 'No token or invalid token'),
    Exception(403, 'Permission denied'),
  );
};

import { UseGuards, applyDecorators } from '@nestjs/common';
import { Exception } from '../../common/decorator/exception.decorator';
import { LoginAuthGuard } from './auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export const LoginAuth = () => {
  return applyDecorators(
    UseGuards(LoginAuthGuard),
    ApiBearerAuth('token'),
    Exception(401, 'No token or invalid token'),
    Exception(423, 'Suspend user'),
  );
};

import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';

export function LoginAuth() {
  return applyDecorators(
    UseGuards(AuthGuard),
    ApiResponse({ status: 401, description: 'No token or invalid token' }),
    ApiResponse({
      status: 403,
      description: 'Admin permission required',
    }),
  );
}

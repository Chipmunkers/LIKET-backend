import { applyDecorators, HttpException } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

export const Exception = (
  status: number,
  description: string,
  Exception?: new (...args: any[]) => HttpException,
) => {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      type: Exception,
    }),
  );
};

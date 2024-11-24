import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const FilesUpload = (fieldName: string, fileLimit: number, options: MulterOptions) => {
  return applyDecorators(
    UseInterceptors(FilesInterceptor(fieldName, fileLimit, options)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'array',
            minLength: 1,
            maxLength: fileLimit,
            description: '업로드할 파일 ([Try it out] 버튼을 누르면 입력칸이 보입니다.)',
            items: {
              type: 'string',
              format: 'binary',
            },
          },
        },
      },
    }),
  );
};

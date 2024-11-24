import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const FileUpload = (fieldName: string, options: MulterOptions) => {
  return applyDecorators(
    UseInterceptors(FileInterceptor(fieldName, options)),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [fieldName]: {
            type: 'string',
            format: 'binary',
            description: '업로드할 파일 ([Try it out] 버튼을 누르면 입력칸이 보입니다.)',
          },
        },
      },
    }),
  );
};

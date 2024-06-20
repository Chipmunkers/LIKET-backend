import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterOptionProvider } from './multer-option.provider';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const UploadFiles = (
  field: string,
  fileLimitCount: number,
  type: 'img',
  limits: number = 1 * 1024 * 1024,
) => {
  let mimetype: string[] = [];
  if (type === 'img') {
    mimetype = ['image/png', 'image/jpeg'];
  }

  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(
        field,
        fileLimitCount,
        MulterOptionProvider.createOption({
          mimetype,
          limits,
        }),
      ),
    ),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          [field]: {
            type: 'array',
            minLength: 1,
            maxLength: fileLimitCount,
            description:
              '업로드할 파일 ([Try it out] 버튼을 누르면 입력칸이 보입니다.)',
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

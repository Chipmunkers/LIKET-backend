import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptionProvider } from './multer-option.provider';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

export const UploadFile = (
  field: string,
  type: 'img',
  limits: number = 1 * 1024 * 1024,
) => {
  let mimetype: string[] = [];
  if (type === 'img') {
    mimetype = ['image/png', 'image/jpeg'];
  }

  return applyDecorators(
    UseInterceptors(
      FileInterceptor(
        field,
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
            type: 'string',
            format: 'binary',
            description:
              '업로드할 파일 ([Try it out] 버튼을 누르면 입력칸이 보입니다.)',
          },
        },
      },
    }),
  );
};

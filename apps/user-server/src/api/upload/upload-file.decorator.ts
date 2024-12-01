import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptionProvider } from './multer-option.provider';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

/**
 * 파일 업로드 데코레이터.
 * 스웨거에 파일 input 필드가 들어감.
 * body가 섞여있을 경우 body는 스웨거에 표시되지 않을 가능성이 있음.
 * 파일을 업로드하는 API는 다른 필드가 없는 것을 권장함.
 *
 * @author jochongs
 */
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

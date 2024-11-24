import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadFileEntity } from './entity/upload-file.entity';
import { FILE_GROUPING } from './dto/file-grouping';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileUpload } from './file-upload.decorator';
import { MulterOptionProvider } from './multer-option.provider';
import { LoginAuth } from '../../api/auth/login-auth.decorator';
import { FilesUpload } from './files-upload.decorator';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 배너 이미지 업로드하기
   */
  @Post('banner')
  @HttpCode(200)
  @ApiTags('Banner')
  @ApiResponse({ status: 400, description: 'No uploaded files' })
  @LoginAuth()
  @FileUpload(
    'file',
    MulterOptionProvider.createOption({
      mimetype: ['image/png', 'image/jpeg'],
      limits: 10 * 1024 * 1024,
    }),
  )
  public async uploadtBannerImg(
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<UploadFileEntity> {
    if (!file) {
      throw new BadRequestException('Fail to upload');
    }

    return await this.uploadService.uploadFileToS3(file, {
      destination: 'banner',
      grouping: FILE_GROUPING.BANNER,
    });
  }

  /**
   * 문화생활컨텐츠 이미지 업로드하기
   */
  @Post('/culture-content')
  @HttpCode(200)
  @ApiTags('Culture-Content')
  @ApiResponse({ status: 400, description: 'No uploaded files' })
  @LoginAuth()
  @FilesUpload(
    'file',
    10,
    MulterOptionProvider.createOption({
      mimetype: ['image/png', 'image/jpeg'],
      limits: 10 * 1024 * 1024,
    }),
  )
  public async uploadCultureCcontentImgs(@UploadedFiles() files?: Express.Multer.File[]) {
    if (!files || !files.length) {
      throw new BadRequestException('Fail to upload');
    }

    return await this.uploadService.uploadFilesToS3(files, {
      destinaion: 'culture-content',
      grouping: FILE_GROUPING.CULTURE_CONTENT,
    });
  }
}

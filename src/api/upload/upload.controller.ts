import {
  BadRequestException,
  Controller,
  HttpCode,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UtilService } from '../../util/util.service';
import { MulterOptionProvider } from './multer-option.provider';
import { LoginAuthGuard } from '../../common/guard/auth.guard';
import { FILE_GROUPING } from './file-grouping';
import { UploadFileResponseDto } from './dto/response/UploadFileResponseDto';
import { User } from '../../common/decorator/user.decorator';
import { LoginUserDto } from '../../common/dto/LoginUserDto';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly uploadService: UploadService,
    private readonly utilService: UtilService,
  ) {}

  /**
   * Upload culture-content images
   *
   * @ignore
   */
  @Post('/content-img')
  @HttpCode(200)
  @UseGuards(LoginAuthGuard)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
      MulterOptionProvider.createOption({
        mimetype: ['image/png', 'image/jpeg'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
  public async uploadCulutrContentImgs(
    @User() loginUser: LoginUserDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<UploadFileResponseDto[]> {
    if (!files || !files.length) {
      throw new BadRequestException('Cannot find uploaded file');
    }

    return await this.uploadService.uploadFilesToS3(
      files,
      {
        destinaion: 'culture-content',
        grouping: FILE_GROUPING.CULTURE_CONTENT,
      },
      loginUser.idx,
    );
  }

  /**
   * Upload inquiry images
   *
   * @ignore
   */
  @Post('/inquiry')
  @HttpCode(200)
  @UseGuards(LoginAuthGuard)
  @UseInterceptors(
    FilesInterceptor(
      'files',
      10,
      MulterOptionProvider.createOption({
        mimetype: ['image/png', 'image/jpeg'],
        limits: 1 * 1024 * 1024,
      }),
    ),
  )
  public async uploadInquiryImgs(
    @User() loginUser: LoginUserDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<UploadFileResponseDto[]> {
    if (!files || !files.length) {
      throw new BadRequestException('Cannot find uploaded file');
    }

    return await this.uploadService.uploadFilesToS3(
      files,
      {
        destinaion: 'inquiry',
        grouping: FILE_GROUPING.INQUIRY,
      },
      loginUser.idx,
    );
  }
}

import { IsString, Length } from 'class-validator';

export class UploadedFileDto {
  /**
   * 파일 경로
   *
   * @example /banner/img_123123.png
   */
  @IsString()
  @Length(1)
  path: string;
}

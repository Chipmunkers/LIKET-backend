import { IsInt, IsNotEmptyObject, IsString, Length, ValidateNested } from 'class-validator';
import { UploadedFileDto } from '../../../../common/upload/dto/request/uploaded-file.dto';
import { Type } from 'class-transformer';

export class CreateBannerDto {
  /**
   * 배너 이름
   *
   * @example 디올 팝업스토어 광고 배너
   */
  @IsString()
  @Length(1, 10)
  public name: string;

  /**
   * 업로드 파일 정보
   */
  @ValidateNested()
  @IsNotEmptyObject()
  @Type(() => UploadedFileDto)
  public file: UploadedFileDto;

  /**
   * 배너 링크
   *
   * @example https://google.com
   */
  @IsString()
  @Length(1, 2000)
  public link: string;
}

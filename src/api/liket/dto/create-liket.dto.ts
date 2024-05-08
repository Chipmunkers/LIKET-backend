import { ArrayMaxSize, IsArray, ValidateNested } from 'class-validator';
import { UploadFileDto } from '../../upload/dto/upload-file.dto';

export class CreateLiketDto {
  /**
   * 이미지 목록
   */
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  public img: UploadFileDto;

  /**
   * 라이켓 내용
   *
   * @example "낮엔 되게 비싸보이는데\n밤엔 엄청 비싸보이는 디올"
   */
  public description: string;
}

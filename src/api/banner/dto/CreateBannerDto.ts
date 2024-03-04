import { IsString, Length, ValidateNested } from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class CreateBannerDto {
  @Length(1, 100)
  name: string;

  @IsString()
  @Length(1, 2000)
  link: string;

  @ValidateNested()
  img: UploadFileDto;
}

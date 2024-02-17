import { ValidateNested } from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class CreateLiketDto {
  @ValidateNested()
  img: UploadFileDto;
  description: string;
}

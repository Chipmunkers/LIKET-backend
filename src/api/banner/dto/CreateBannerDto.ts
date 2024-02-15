import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class CreateBannerDto {
  name: string;
  link: string;
  img: UploadFileDto;
}

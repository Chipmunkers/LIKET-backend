import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class SignUpDto {
  emailToken: string;
  pw: string;
  nickname: string;
  gender?: 1 | 2;
  birth?: number;
  profileImg?: UploadFileDto;
}

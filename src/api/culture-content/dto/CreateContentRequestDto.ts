import { CreateLocationDto } from '../../../common/dto/CreateLocationDto';
import { ValidateNested } from 'class-validator';
import { UploadFileDto } from '../../upload/dto/UploadFileDto';

export class CreateContentRequestDto {
  title: string;
  description: string;
  websiteLink: string;

  @ValidateNested()
  imgList: UploadFileDto[];

  genreIdx: number;
  ageIdx: number;
  styleIdxList: number;

  @ValidateNested()
  location: CreateLocationDto;

  startDate: string;
  endDate: string;
  openTime: string;

  isFee: boolean;
  isReservation: boolean;
  isPet: boolean;
  isParking: boolean;
}

import { TagDto } from './TagDto';

export class CultureContentRequestDto {
  idx: number;
  title: string;
  description: string;
  websiteLink: string;
  imgList: string[];
  thumbnail: string;

  author: {
    idx: number;
    nickname: string;
    profileImgPath: string;
  };

  genre: TagDto;
  style: TagDto[];
  age: TagDto;
  location: {};

  startDate: Date;
  endDate: Date;
  openTime: string;

  isFee: boolean;
  isReservation: boolean;
  isPet: boolean;
  isParking: boolean;

  likeCount: number;

  acceptedAt: Date | null;
  createdAt: Date;
}

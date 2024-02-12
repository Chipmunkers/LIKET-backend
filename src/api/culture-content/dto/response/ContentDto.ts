import { PickType } from '@nestjs/swagger';
import { CultureContentRequestDto } from './ContentRequestDto';

export class ContentDto extends PickType(CultureContentRequestDto, [
  'idx',
  'title',
  'description',
  'websiteLink',
  'imgList',
  'thumbnail',
  'genre',
  'style',
  'age',
  'location',
  'startDate',
  'endDate',
  'openTime',
  'isFee',
  'isReservation',
  'isParking',
  'isPet',
  'likeCount',
  'createdAt',
]) {
  likeState: boolean;
  reviewCount: number;
  avgStarRating: number | null;
}

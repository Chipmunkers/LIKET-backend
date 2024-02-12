import { PickType } from '@nestjs/swagger';
import { ContentDto } from './ContentDto';

export class SummaryContentDto extends PickType(ContentDto, [
  'idx',
  'title',
  'thumbnail',
  'genre',
  'startDate',
  'endDate',
  'likeState',
  'createdAt',
]) {
  location: {
    region1Depth: string;
    region2Depth: string;
  };
}

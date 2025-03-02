import { PickType } from '@nestjs/swagger';
import { ContentEntity } from 'apps/user-server/src/api/culture-content/entity/content.entity';

/**
 * @author jochongs
 */
export class ReviewCultureContentEntity extends PickType(ContentEntity, [
  'idx',
  'title',
  'genre',
  'likeCount',
  'thumbnail',
]) {}

import { PickType } from '@nestjs/swagger';
import { LiketEntity } from '../entity/liket.entity';

/**
 * @author wherehows
 */
export class CreateLiketDto extends PickType(LiketEntity, [
  'size',
  'textShape',
  'cardImgPath',
  'bgImgPath',
  'bgImgInfo',
  'imgShapes',
  'description',
]) {}

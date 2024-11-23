import { PickType } from '@nestjs/swagger';
import { LiketEntity } from '../entity/liket.entity';

export class CreateLiketDto extends PickType(LiketEntity, [
  'size',
  'textShape',
  'cardImgPath',
  'bgImgPath',
  'bgImgInfo',
  'imgShapes',
  'description',
]) {}

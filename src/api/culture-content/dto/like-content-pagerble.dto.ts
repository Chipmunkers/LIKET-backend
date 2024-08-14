import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';
import { ToBoolean } from '../../../common/decorator/to-boolean.decorator';
import { IsBoolean } from 'class-validator';

export class LikeContentPagerbleDto extends PickType(PagerbleDto, ['page']) {
  @ToBoolean()
  @IsBoolean()
  onlyopen: boolean;
}

import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';

export class GetMyLiketPagerbleDto extends PickType(PagerbleDto, ['page']) {}

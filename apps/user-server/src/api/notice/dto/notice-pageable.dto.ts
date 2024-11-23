import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../common/dto/pagerble.dto';

export class NoticePageableDto extends PickType(PagerbleDto, ['page']) {}

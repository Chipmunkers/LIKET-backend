import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';

export class GetLiketAllPagerbleDto extends PickType(PagerbleDto, ['page'] as const) {}

import { PickType } from '@nestjs/swagger';
import { PagenationDto } from '../../../common/dto/PagenationDto';

export class GetMyLiketPagerbleDto extends PickType(PagenationDto, ['page']) {}

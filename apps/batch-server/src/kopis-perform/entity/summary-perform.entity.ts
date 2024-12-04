import { PickType } from '@nestjs/swagger';
import { PerformEntity } from './perform.entity';

export class SummaryPerformEntity extends PickType(PerformEntity, [
  'mt20id',
  'prfnm',
  'genrenm',
  'prfstate',
  'prfpdto',
  'poster',
  'fcltynm',
  'openrun',
]) {
  /**
   * 공연 지역
   *
   * @example 서울 특별시
   */
  area: string;
}

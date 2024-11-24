import { PickType } from '@nestjs/swagger';
import { PagerbleDto } from '../../../../common/dto/request/pagerble.dto';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class NoticePageableDto extends PickType(PagerbleDto, ['page', 'order']) {
  /**
   * 검색 키워드
   *
   * @example "서비스 업데이트"
   */
  @IsString()
  @Length(1, 20)
  @IsOptional()
  search?: string;

  /**
   * 상태 (pin인 경우 고정된 공지사항 전체 가져옴)
   *
   * @example active
   */
  @IsString()
  @IsIn(['active', 'deactivation', 'pin'])
  @IsOptional()
  state?: 'active' | 'deactivation' | 'pin';
}

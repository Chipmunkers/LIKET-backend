import { PickType } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, Length } from 'class-validator';
import { PagenationDto } from '../../../common/dto/PagenationDto';

export class UserListPagenationDto extends PickType(PagenationDto, ['page']) {
  @IsString()
  @Length(1, 10)
  @IsOptional()
  search?: string;

  @IsString()
  @IsIn(['block', 'unblock'])
  @IsOptional()
  filter?: 'block' | 'unblock';

  @IsString()
  @IsIn(['desc', 'asc'])
  order: 'desc' | 'asc' = 'desc';
}

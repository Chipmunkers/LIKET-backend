import { IsIn, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class UserListPagenationDto {
  @IsInt()
  page: number = 1;

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
  @IsOptional()
  order: 'desc' | 'asc' = 'desc';
}

import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class PagenationDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;
}

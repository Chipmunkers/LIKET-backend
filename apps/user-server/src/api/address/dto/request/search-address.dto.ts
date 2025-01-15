import { IsString, Length } from 'class-validator';

export class SearchAddressDto {
  @IsString()
  @Length(1, 20)
  search: string;
}

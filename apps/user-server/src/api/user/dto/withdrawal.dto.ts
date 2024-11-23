import { IsInt, IsOptional, IsString, Length } from 'class-validator';

export class WithdrawalDto {
  @IsString()
  @IsOptional()
  @Length(0, 200)
  public contents: string;

  @IsInt()
  public type: number;
}

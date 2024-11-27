import { IsInt, IsOptional, IsString, Length } from 'class-validator';

/**
 * @author jochongs
 */
export class WithdrawalDto {
  @IsString()
  @IsOptional()
  @Length(0, 200)
  public contents: string;

  @IsInt()
  public type: number;
}

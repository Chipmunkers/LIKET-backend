import { IsIn, IsInt, IsOptional, IsString, Length } from 'class-validator';
import {
  WITHDRAWAL_REASON_TYPE,
  WithdrawalReasonType,
} from 'libs/core/withdrawal-reason/constant/withdrawal-reason-type';

/**
 * @author jochongs
 */
export class WithdrawalDto {
  @IsString()
  @IsOptional()
  @Length(0, 200)
  public contents: string;

  @IsInt()
  @IsIn(Object.values(WITHDRAWAL_REASON_TYPE))
  public type: WithdrawalReasonType;
}

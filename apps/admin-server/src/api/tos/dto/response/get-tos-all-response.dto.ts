import { SummaryTosEntity } from '../../entity/summary-tos.entity';

export class GetTosAllResponseDto {
  tosList: SummaryTosEntity[];
  count: number;
}

import { SummaryLiketEntity } from '../../entity/summary-liket.entity';

export class GetLiketAllResponseDto {
  liketList: SummaryLiketEntity[];
  count: number;
}

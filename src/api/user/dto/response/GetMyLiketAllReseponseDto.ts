import { LiketEntity } from '../../../liket/entity/LiketEntity';

export class GetMyLiketAllResponseDto {
  liketList: LiketEntity<'summary'>[];
}

import { TosEntity } from '../../entity/TosEntity';

export class GetUserTosAllResponseDto {
  tosList: TosEntity<'summary', 'user'>[];
}

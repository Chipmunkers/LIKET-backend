import { TosEntity } from '../../entity/TosEntity';

export class GetAdminTosAllResponseDto {
  tosList: TosEntity<'summary', 'admin'>[];
}

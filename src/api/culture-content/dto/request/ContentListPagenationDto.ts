export class ContentListPagenationDto {
  genre?: number;
  age?: number;
  region?: number;
  style?: number;
  open?: boolean;
  order?: 'desc' | 'asc';
  orderby?: 'time' | 'like';
  search?: string;
}

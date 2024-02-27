export class ReviewListPagerbleDto {
  page: number;
  searchby: 'idx' | 'nickname' | 'contents';
  search: string;
  order: 'desc' | 'asc';
}

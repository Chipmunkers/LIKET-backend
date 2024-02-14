export class ReviewListPagerble {
  page: number;
  searchby: 'idx' | 'nickname' | 'contents';
  search: string;
  order: 'desc' | 'asc';
}

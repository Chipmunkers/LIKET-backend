export class CreateReviewDto {
  starRating: 1 | 2 | 3 | 4 | 5;
  visitTime: Date;
  imgList: string[];
  description: string;
}

import { IsString, Length } from 'class-validator';

export class CreateAnswerDto {
  /**
   * 답변 내용
   */
  @IsString()
  @Length(1, 200)
  contents: string;
}

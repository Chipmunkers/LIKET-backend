import { IsString, Length } from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @Length(1, 200)
  contents: string;
}

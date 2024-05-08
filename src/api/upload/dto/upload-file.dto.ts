import { IsString, Length } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @Length(1)
  filePath: string;
}

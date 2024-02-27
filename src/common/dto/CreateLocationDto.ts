import { IsDecimal, IsString, Length } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  @Length(1, 200)
  address: string;

  @IsString()
  @Length(1, 200)
  detailAddress: string;

  @IsString()
  @Length(1, 20)
  region1Depth: string;

  @IsString()
  @Length(1, 20)
  region2Depth: string;

  @IsString()
  @Length(1, 20)
  hCode: string;

  @IsString()
  @Length(1, 20)
  bCode: string;

  @IsDecimal()
  positionX: number;

  @IsDecimal()
  positionY: number;
}

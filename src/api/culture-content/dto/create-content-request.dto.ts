import { CreateLocationDto } from '../../../common/dto/CreateLocationDto';
import {
  ArrayMaxSize,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { UploadFileDto } from '../../upload/dto/upload-file.dto';
import { Type } from 'class-transformer';

export class CreateContentRequestDto {
  /**
   * 컨텐츠 명
   *
   * @example 디올 팝업스토어
   */
  @IsString()
  @Length(1, 40)
  title: string;

  /**
   * 컨텐츠 설명
   *
   * @example "서울에서 만나는 디올의 특별한 컨셉 스토어\nDIOR SEONGSU에서 펼쳐지는\n매혹적인 홀리데이 시즌을 경험해보세요.\n주중 | DIOR SEONGSU 앱을 통한 방문 예약 \n또는 현장 접수 가능\n주말 | 현장 접수만 가능\n12월 예약 서비스는 12월 4일 오후12시에 오픈 되오니,\n많은 관심 부탁드립니다."
   */
  @IsString()
  @Length(1, 200)
  description: string;

  /**
   * 컨텐츠 웹사이트 링크
   *
   * @example "https://google.com"
   */
  @IsString()
  @Length(1, 2000)
  websiteLink: string;

  /**
   * 컨텐츠 이미지 배열
   */
  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  @IsOptional()
  @Type(() => UploadFileDto)
  imgList: UploadFileDto[] = [];

  /**
   * 장르 인덱스
   *
   * @example 5
   */
  @IsInt()
  genreIdx: number;

  /**
   * 연령대 인덱스
   *
   * @example 4
   */
  @IsInt()
  ageIdx: number;

  /**
   * 스타일 인덱스
   *
   * @example [1, 4, 5]
   */
  @IsInt({ each: true })
  @ArrayMaxSize(10)
  styleIdxList: number[];

  /**
   * 컨텐츠 지역
   */
  @ValidateNested()
  location: CreateLocationDto;

  /**
   * 시작 날짜
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  startDate: string;

  /**
   * 끝나는 날짜
   *
   * @example 2024-05-07T00:00:00.000Z
   */
  @IsDateString()
  endDate: string;

  /**
   * 오픈 시간
   *
   * @example "월-금 12:00-20:00   토-일 11:00-20:00"
   */
  @IsString()
  openTime: string;

  /**
   * 요금 여부
   *
   * @example true
   */
  @IsBoolean()
  isFee: boolean;

  /**
   * 예약 필수 여부
   *
   * @example false
   */
  @IsBoolean()
  isReservation: boolean;

  /**
   * 반려동물 입장 가능 여부
   *
   * @example true
   */
  @IsBoolean()
  isPet: boolean;

  /**
   * 주차 가능 여부
   *
   * @example true
   */
  @IsBoolean()
  isParking: boolean;
}

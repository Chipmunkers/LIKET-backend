import { CreateCultureContentLocationInput } from 'libs/core/culture-content/input/create-culture-content-location.input';
import { Age } from 'libs/core/tag-root/age/constant/age';
import { Genre } from 'libs/core/tag-root/genre/constant/genre';
import { Style } from 'libs/core/tag-root/style/constant/style';

/**
 * @author jochongs
 */
export class CreateCultureContentInput {
  /** 장르 */
  public readonly genreIdx: Genre;

  /**
   * 작성자 식별자
   *
   * @default 1 관리자
   */
  public readonly authorIdx: number | null;

  /** 연령대 */
  public readonly ageIdx: Age;

  /** 스타일 목록 */
  public readonly styleIdxList: Style[];

  /** 장소 */
  public readonly location: CreateCultureContentLocationInput;

  /** 컨텐츠 아이디 */
  public readonly id: string | null;

  /** 제목 */
  public readonly title: string;

  /** 컨텐츠 이미지 경로 배열 */
  public readonly imgList: string[];

  /** 설명 */
  public readonly description: string | null;

  /** 웹 사이트 링크 */
  public readonly websiteLink: string | null;

  /** 시작 날짜 */
  public readonly startDate: Date;

  /** 종료 날짜 */
  public readonly endDate: Date | null;

  /** 오픈 날짜 */
  public readonly openTime: string | null;

  /** 요금 여부 */
  public readonly isFee: boolean;

  /** 예약 필수 여부 */
  public readonly isReservation: boolean;

  /** 주차장 존재 여부 */
  public readonly isParking: boolean;

  /** 반려동물 출입 가능 여부 */
  public readonly isPet: boolean;
}

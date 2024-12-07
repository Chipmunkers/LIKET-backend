import { TempContentLocationEntity } from './temp-content-location.entity';

/**
 * RawTempContentEntity를 가공한 Entity
 *
 * @author jochongs
 */
export class TempContentEntity {
  /** 공연 ID */
  id: string;

  /** 공연 장소 주소 데이터 */
  location: TempContentLocationEntity;

  /** 장르 인덱스 */
  genreIdx: number;

  /** 연령대 인덱스 */
  ageIdx: number | null;

  /** 공연명 */
  title: string;

  /** 이미지 목록 */
  imgList: string[];

  /** 공연 설명 */
  description: string | null;

  /** 웹사이트 링크 */
  websiteLink: string;

  /** 시작일 */
  startDate: Date;

  /** 종료일 */
  endDate: Date | null;

  /** 오픈 시간 */
  openTime: string;

  /** 요금 여부 */
  isFee: boolean;

  /** 예약 필수 여부 */
  isReservation: boolean;

  /** 반료 동물 출입 여부 */
  isPet: boolean;

  /** 주차 가능 여부 */
  isParking: boolean;

  constructor(data: TempContentEntity) {
    Object.assign(this, data);
  }

  static create(content: TempContentEntity) {
    return new TempContentEntity(content);
  }
}

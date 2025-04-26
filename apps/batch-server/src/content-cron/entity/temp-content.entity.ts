import { LocationEntity } from './location.entity';

/**
 * 컨텐츠를 데이터 베이스에 저장하기 위한 임시 컨텐츠 엔티티
 * 해당 엔티티는 아직 DB에 저장되지 않은 상태에서 사용
 *
 * @author jochongs
 */
export class TempContentEntity {
  /** 공연 ID, content key가 붙어있지 않음에 주의 */
  id: string;

  /** 공연 장소 주소 데이터 */
  location: LocationEntity;

  /** 장르 인덱스 */
  genreIdx: number;

  /** 연령대 인덱스 */
  ageIdx: number;

  /** 스타일 인덱스 */
  styleIdxList: number[];

  /** 공연명 */
  title: string;

  /** 이미지 목록 */
  imgList: string[];

  /** 공연 설명 */
  description: string | null;

  /** 웹사이트 링크 */
  websiteLink: string | null;

  /** 시작일 */
  startDate: Date;

  /** 종료일 */
  endDate: Date | null;

  /** 오픈 시간 */
  openTime: string | null;

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

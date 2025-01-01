import { FestivalImgEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival-img.entity';
import { FestivalInfoEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival-info.entity';
import { FestivalIntroEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/festival-intro.entity';
import { SummaryFestivalEntity } from 'apps/batch-server/src/content-cron/external-apis/tour/entity/summary-festival.entity';

/**
 * @author jochongs
 */
export class FestivalEntity {
  /**
   * GPS X좌표(WGS84 경도좌표)
   */
  mapX: string;

  /**
   * GPS Y좌표(WGS84 위도좌표)
   */
  mapY: string;

  /**
   * Map Level
   */
  mapLevel: string | null;

  /**
   * 콘텐츠 수정일
   *
   * @example 20241231135236
   */
  modifiedTime: string;

  /**
   * 표출 여부
   */
  showFlag: '1' | '0';

  /**
   * 시군구 코드
   */
  siGunGuCode: string;

  /**
   * 전화번호
   */
  tel: string | null;

  /**
   * 콘텐츠 제목
   */
  title: string;

  /**
   * 주소(예, 서울중구다동
   */
  addr1: string;

  /**
   * 상세 주소
   */
  addr2: string | null;

  /**
   * 지역 코드
   */
  areaCode: string;

  /**
   * 교과서속여행지여부(1=여행지, 0=해당없음)
   */
  bookTour: '0' | '1' | null;

  /**
   * 대분류 코드
   */
  cat1: string | null;

  /**
   * 중분류 코드
   */
  cat2: string | null;

  /**
   * 소분류 코드
   */
  cat3: string | null;

  /**
   * 콘텐츠 ID
   */
  contentId: string;

  /**
   * 관광 타입 ID
   */
  contentTypeId: string;

  /**
   * 콘텐츠 최초 등록일
   *
   * @example 20241231135236
   */
  createdTime: string;

  /**
   * 원본 대표 이미지
   */
  posterOrigin: string;

  /**
   * 썸네일 대표 이미지
   */
  posterSmall: string;

  /**
   * 우편 번호
   */
  zipCode: string;

  /**
   * 축제 정보
   */
  info: FestivalInfoEntity;

  /**
   * 이미지 배열
   */
  imgList: FestivalImgEntity[];

  /**
   * 컨텐츠 소개 데이터
   */
  intro: FestivalIntroEntity;

  constructor(data: FestivalEntity) {
    Object.assign(this, data);
  }

  static createEntity(
    festival: SummaryFestivalEntity,
    infoEntity: FestivalInfoEntity,
    imgList: FestivalImgEntity[],
    festivalIntro: FestivalIntroEntity,
  ): FestivalEntity {
    return new FestivalEntity({
      ...festival,
      info: infoEntity,
      imgList,
      intro: festivalIntro,
    });
  }
}

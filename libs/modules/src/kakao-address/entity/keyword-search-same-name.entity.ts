import { KeywordSearchSameName } from 'libs/modules/kakao-address/type/keyword-search-same-name';

/**
 * @author jochongs
 */
export class KeywordSearchSameNameEntity {
  /**
   * 질의어에서 인식된 지역의 리스트
   * 예: '중앙로 맛집' 에서 중앙로에 해당하는 지역 리스트
   */
  region: string[];

  /**
   * 질의어에서 지역 정보를 제외한 키워드
   * 예: '중앙로 맛집' 에서 '맛집'
   */
  keyword: string | null;

  /**
   * 인식된 지역 리스트 중, 현재 검색에 사용된 지역 정보
   */
  selectedRegion: string | null;

  constructor(data: KeywordSearchSameNameEntity) {
    Object.assign(this, data);
  }

  static createEntity(sameName: KeywordSearchSameName) {
    return new KeywordSearchSameNameEntity({
      region: sameName.region,
      keyword: sameName.keyword === '' ? null : sameName.keyword,
      selectedRegion:
        sameName.selected_region === '' ? null : sameName.selected_region,
    });
  }
}

import { KeywordSearchSameNameEntity } from 'libs/modules/kakao-address/entity/keyword-search-same-name.entity';
import { KeywordSearchMeta } from 'libs/modules/kakao-address/type/keyword-search-meta';

/**
 * @author jochongs
 */
export class KeywordSearchMetaEntity {
  /**
   * 검색어에 검색된 문서 수
   */
  totalCount: number;

  /**
   * total_count 중 노출 가능 문서 수 (최대: 45)
   */
  pageableCount: number;

  /**
   * 현재 페이지가 마지막 페이지인지 여부
   * 값이 false면 다음 요청 시 page 값을 증가시켜 다음 페이지 요청 가능
   */
  isEnd: boolean;

  /**
   * 질의어의 지역 및 키워드 분석 정보
   */
  sameName: KeywordSearchSameNameEntity;

  constructor(data: KeywordSearchMetaEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: KeywordSearchMeta) {
    return new KeywordSearchMetaEntity({
      totalCount: data.total_count,
      pageableCount: data.pageable_count,
      isEnd: data.is_end,
      sameName: KeywordSearchSameNameEntity.createEntity(data.same_name),
    });
  }
}

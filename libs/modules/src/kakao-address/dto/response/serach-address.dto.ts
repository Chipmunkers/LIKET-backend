import { AddressSearchMetaEntity } from 'libs/modules/kakao-address/entity/address-search-meta.entity';
import { AddressSearchDocumentEntity } from 'libs/modules/kakao-address/entity/address-search-document.entity';

export class SearchAddressResponseDto {
  /**
   * 검색 메타 데이터
   */
  meta: AddressSearchMetaEntity;

  /**
   * 검색된 데이터들
   */
  documents: AddressSearchDocumentEntity[];
}

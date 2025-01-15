import { KeywordSearchResponseDto } from 'libs/modules/kakao-address/dto/response/keyword-search.dto';
import { KeywordSearchDocumentEntity } from 'libs/modules/kakao-address/entity/keyword-search-document.entity';
import { KeywordSearchMetaEntity } from 'libs/modules/kakao-address/entity/keyword-search-meta.entity';

/**
 * @author jochongs
 */
export class KeywordSearchResultEntity {
  meta: KeywordSearchMetaEntity;
  documents: KeywordSearchDocumentEntity[];

  constructor(data: KeywordSearchResultEntity) {
    Object.assign(this, data);
  }

  static createEntity(data: KeywordSearchResponseDto) {
    return new KeywordSearchResultEntity({
      meta: KeywordSearchMetaEntity.createEntity(data.meta),
      documents: data.documents.map((doc) =>
        KeywordSearchDocumentEntity.createEntity(doc),
      ),
    });
  }
}

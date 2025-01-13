import { KeywordSearchDocument } from 'libs/modules/kakao-address/type/keyword-search-document';
import { KeywordSearchMeta } from 'libs/modules/kakao-address/type/keyword-search-meta';

/**
 * @author jochongs
 */
export class KeywordSearchResponseDto {
  meta: KeywordSearchMeta;
  documents: KeywordSearchDocument[];
}

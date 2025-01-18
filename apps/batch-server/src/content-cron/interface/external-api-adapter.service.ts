import { UpdateContentInfo } from 'apps/batch-server/src/content-cron/external-apis/kopis/type/UpdateContentInfo';
import { TempContentEntity } from '../culture-content/entity/temp-content.entity';

/**
 * 외부 API로 컨텐츠를 받아왔다면 그 데이터를 ContentEntity로 변경하는 메서드
 *
 * @author jochongs
 */
export interface IExternalApiAdapterService<Detail = any> {
  /**
   * TempContentEntity로 normalization하는 메서드
   */
  transform(data: Detail): Promise<TempContentEntity>;

  /**
   * 수정할 정보 목록 보는 메서드
   */
  extractUpdateData(data: Detail): Promise<UpdateContentInfo>;
}

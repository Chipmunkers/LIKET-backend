import { PickType } from '@nestjs/swagger';
import { TagEntity } from '../../content-tag/entity/tag.entity';
import { ContentEntity } from './content.entity';
import { SelectHotContentFieldPrisma } from 'apps/user-server/src/api/culture-content/entity/prisma/select-hot-content-field';
import { SummaryCultureContentModel } from 'libs/core/culture-content/model/summary-culture-content.model';

/**
 * @author jochongs
 */
export class HotCultureContentEntity extends PickType(ContentEntity, [
  'idx',
  'title',
  'startDate',
  'endDate',
  'thumbnail',
]) {
  constructor(data: HotCultureContentEntity) {
    super();
    Object.assign(this, data);
  }

  /**
   * core 모듈이 개발됨에 따라 deprecated 되었습니다.
   * 대신, fromModel 정적 메서드를 활용하십시오.
   *
   * @deprecated
   */
  static createEntity(
    content: SelectHotContentFieldPrisma,
  ): HotCultureContentEntity {
    return new HotCultureContentEntity({
      idx: content.idx,
      title: content.title,
      startDate: content.startDate,
      endDate: content.endDate,
      thumbnail: content.ContentImg[0]?.imgPath || '',
    });
  }

  public static fromModel(
    model: SummaryCultureContentModel,
  ): HotCultureContentEntity {
    return new HotCultureContentEntity({
      idx: model.idx,
      startDate: model.startDate,
      endDate: model.endDate,
      thumbnail: model.imgList[0]?.imgPath || '',
      title: model.title,
    });
  }
}

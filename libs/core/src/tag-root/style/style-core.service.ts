import { Injectable } from '@nestjs/common';
import { Style } from 'libs/core/tag-root/style/constant/style';
import { FindManyStyleInput } from 'libs/core/tag-root/style/input/find-many-style.input';
import { StyleModel } from 'libs/core/tag-root/style/model/style.model';
import { StyleCoreRepository } from 'libs/core/tag-root/style/style-core.repository';

@Injectable()
export class StyleCoreService {
  constructor(private readonly styleCoreRepository: StyleCoreRepository) {}

  /**
   * 스타일 목록을 불러오는 메서드
   *
   * @author jochongs
   */
  public async getStyleAll(input: FindManyStyleInput): Promise<StyleModel[]> {
    return (await this.styleCoreRepository.selectStyleAll(input)).map(
      StyleModel.fromPrisma,
    );
  }

  /**
   * 스타일 하나를 찾는 메서드
   *
   * @author jochongs
   *
   * @param idx 스타일 식별자
   */
  public async findStyleByIdx(idx: Style): Promise<StyleModel | null> {
    const style = await this.styleCoreRepository.selectStyleByIdx(idx);

    return style && StyleModel.fromPrisma(style);
  }
}

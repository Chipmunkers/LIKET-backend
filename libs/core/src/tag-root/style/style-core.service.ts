import { Injectable } from '@nestjs/common';
import { StyleModel } from 'libs/core/tag-root/style/model/style.model';
import { StyleCoreRepository } from 'libs/core/tag-root/style/style-core.repository';

@Injectable()
export class StyleCoreService {
  constructor(private readonly styleCoreRepository: StyleCoreRepository) {}

  /**
   * 스타일 목록 가져오기
   *
   * @author jochongs
   */
  public async selectStyleAll(): Promise<StyleModel[]> {
    return (
      await this.styleCoreRepository.selectStyleAll({
        order: 'asc',
        orderBy: 'idx',
      })
    ).map(StyleModel.fromPrisma);
  }

  /**
   * 스타일 가져오기
   *
   * @author jochongs
   */
  public async selectStyleByIdx(idx: number): Promise<StyleModel | null> {
    const style = await this.styleCoreRepository.selectStyleByIdx(idx);

    return style && StyleModel.fromPrisma(style);
  }

  /**
   * 랜덤 스타일져오기
   *
   * @author jochongs
   */
  public async getRandomStyle(): Promise<StyleModel> {
    const styleList = await this.styleCoreRepository.selectStyleAll({});

    const style = styleList[Math.floor(Math.random() * styleList.length)];

    return StyleModel.fromPrisma(style);
  }
}

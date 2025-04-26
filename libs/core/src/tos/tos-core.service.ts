import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { CreateTosInput } from 'libs/core/tos/input/create-tos.input';
import { FindTosAllInput } from 'libs/core/tos/input/find-tos-all.input';
import { UpdateTosInput } from 'libs/core/tos/input/update-tos.input';
import { SummaryTosModel } from 'libs/core/tos/model/summary-tos.model';
import { TosModel } from 'libs/core/tos/model/tos.model';
import { TosCoreRepository } from 'libs/core/tos/tos-core.repository';

@Injectable()
export class TosCoreService {
  constructor(private readonly tosCoreRepository: TosCoreRepository) {}

  /**
   * 약관 목록보기
   *
   * @author jochongs
   */
  @Transactional()
  public async findTosAll(input: FindTosAllInput): Promise<SummaryTosModel[]> {
    return (await this.tosCoreRepository.selectTosAll(input)).map(
      SummaryTosModel.fromPrisma,
    );
  }

  /**
   * 약관 가져오기
   *
   * @author jochongs
   *
   * @param idx 약관 식별자
   */
  @Transactional()
  public async findTosByIdx(idx: number): Promise<TosModel | null> {
    const tos = await this.tosCoreRepository.selectTosByIdx(idx);

    return tos && TosModel.fromPrisma(tos);
  }

  /**
   * 약관 생성하기
   *
   * @author jochongs
   */
  @Transactional()
  public async createTos(input: CreateTosInput): Promise<TosModel> {
    return TosModel.fromPrisma(await this.tosCoreRepository.insertTos(input));
  }

  /**
   * 약관 수정하기
   *
   * @author jochongs
   */
  @Transactional()
  public async updateTosByIdx(
    idx: number,
    input: UpdateTosInput,
  ): Promise<void> {
    return await this.tosCoreRepository.updateTosByIdx(idx, input);
  }
}

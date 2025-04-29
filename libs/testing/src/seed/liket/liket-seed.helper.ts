import { faker } from '@faker-js/faker';
import { BgImgInfoEntity } from 'apps/user-server/src/api/liket/entity/bg-img-info.entity';
import { DeepRequired } from 'libs/common';
import { ISeedHelper } from 'libs/testing/interface/seed-helper.interface';
import { LiketInput } from 'libs/testing/seed/liket/type/liket.input';
import { LiketOutput } from 'libs/testing/seed/liket/type/liket.output';

/**
 * @author jochongs
 */
export class LiketSeedHelper extends ISeedHelper<LiketInput, LiketOutput> {
  public async seed(input: LiketInput): Promise<LiketOutput> {
    const filledInput = await this.getFilledInputValue(input);

    const createdLiket = await this.prisma.liket.create({
      include: {
        LiketImgShape: true,
      },
      data: {
        reviewIdx: filledInput.reviewIdx,
        bgImgPath: filledInput.bgImgPath,
        bgImgInfo: filledInput.bgImgInfo,
        cardImgPath: filledInput.cardImgPath,
        textShape: filledInput.textShape ?? undefined,
        size: filledInput.size,
        description: filledInput.description,
        deletedAt: filledInput.deletedAt,
        LiketImgShape: {
          createMany: {
            data: filledInput.imgShapeList.map((imgShape) => ({ imgShape })),
          },
        },
      },
    });

    return {
      idx: createdLiket.idx,
      reviewIdx: createdLiket.reviewIdx,
      bgImgPath: createdLiket.bgImgPath,
      bgImgInfo: createdLiket.bgImgInfo as any,
      cardImgPath: createdLiket.cardImgPath,
      textShape: createdLiket.textShape as any,
      size: createdLiket.size,
      description: createdLiket.description,
      imgShapeList: createdLiket.LiketImgShape.map(
        (img) => img.imgShape as any,
      ),
      deletedAt: createdLiket.deletedAt,
    };
  }

  private async getFilledInputValue(
    input: LiketInput,
  ): Promise<DeepRequired<LiketInput>> {
    return {
      reviewIdx: input.reviewIdx,
      bgImgPath: input.bgImgPath ?? this.getRandomBgImgPath(),
      bgImgInfo: input.bgImgInfo ?? this.getRandomBgImgInfo(),
      cardImgPath: input.cardImgPath ?? this.getRandomCardImgPath(),
      textShape: input.textShape ?? null,
      imgShapeList: input.imgShapeList ?? [],
      size: input.size ?? faker.number.int({ min: 0, max: 127 }),
      description: input.description ?? faker.lorem.slug({ min: 2, max: 4 }),
      deletedAt: input.deletedAt ?? null,
    };
  }
  private getRandomBgImgPath(): string {
    return `/liket-bg-img/${faker.lorem.word(7)}.png`;
  }

  private getRandomBgImgInfo(): BgImgInfoEntity {
    return {
      x: faker.number.int({ min: 80, max: 100 }),
      y: faker.number.int({ min: 80, max: 100 }),
      height: faker.number.float({ min: 30, max: 140 }),
      width: faker.number.float({ min: 30, max: 140 }),
      offsetX: faker.number.float({ min: 30, max: 140 }),
      offsetY: faker.number.float({ min: 30, max: 140 }),
      rotation: faker.number.float({ min: -360, max: 360 }),
    };
  }

  private getRandomCardImgPath(): string {
    return `/liket/${faker.lorem.word(7)}.png`;
  }
}

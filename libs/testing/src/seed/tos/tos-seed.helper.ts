import { faker } from '@faker-js/faker';
import { DeepRequired } from 'libs/common';
import { ISeedHelper } from 'libs/testing/interface/seed-helper.interface';

type TosInput = {
  title?: string;
  contents?: string;
  isEssential?: boolean;
  deletedAt?: Date | null;
};

type TosOutput = { idx: number } & DeepRequired<TosInput>;

/**
 * @author jochongs
 */
export class TosSeedHelper extends ISeedHelper<TosInput, TosOutput> {
  public async seed(input: TosInput): Promise<TosOutput> {
    const filledInput = await this.getFilledInputValue(input);

    const createdTos = await this.prisma.tos.create({
      data: {
        title: filledInput.title,
        contents: filledInput.contents,
        isEssential: filledInput.isEssential,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      idx: createdTos.idx,
      title: createdTos.title,
      contents: createdTos.contents,
      isEssential: createdTos.isEssential,
      deletedAt: createdTos.deletedAt,
    };
  }

  private async getFilledInputValue(
    input: TosInput,
  ): Promise<DeepRequired<TosInput>> {
    return {
      title: input.title ?? faker.lorem.slug(3),
      contents: input.contents ?? faker.lorem.sentences(5, '\n'),
      isEssential: input.isEssential ?? faker.datatype.boolean(),
      deletedAt: input.deletedAt ?? null,
    };
  }
}

import { faker } from '@faker-js/faker/.';
import { DeepRequired } from 'libs/common';
import { ISeedHelper } from 'libs/testing/interface/seed-helper.interface';
import { BannerInput } from 'libs/testing/seed/banner/type/banner.input';
import { BannerOutput } from 'libs/testing/seed/banner/type/banner.output';

/**
 * @author jochongs
 */
export class BannerSeedHelper extends ISeedHelper<BannerInput, BannerOutput> {
  public async seed(input: BannerInput): Promise<BannerOutput> {
    const filledInput = await this.getFilledInputValue(input);

    const createdBanner = await this.prisma.banner.create({
      data: {
        name: filledInput.name,
        imgPath: filledInput.imgPath,
        link: filledInput.link,
        deletedAt: filledInput.deletedAt,
      },
    });

    if (input.order) {
      await this.prisma.activeBanner.create({
        data: {
          idx: createdBanner.idx,
          order: input.order,
        },
      });
    }

    return {
      idx: createdBanner.idx,
      imgPath: createdBanner.imgPath,
      name: createdBanner.name,
      link: createdBanner.link,
      order: input.order || null,
      deletedAt: input.deletedAt || null,
    };
  }

  private async getFilledInputValue(
    input: BannerInput,
  ): Promise<DeepRequired<BannerInput>> {
    return {
      name: input.name ?? this.getRandomName(),
      imgPath: input.imgPath ?? this.getRandomImgPath(),
      link: input.link ?? this.getRandomLink(),
      order: input.order ?? null,
      deletedAt: input.deletedAt ?? null,
    };
  }

  private getRandomName() {
    return faker.lorem.word({ strategy: 'shortest' });
  }

  private getRandomLink() {
    return `https://${faker.internet.domainName()}`;
  }

  private getRandomImgPath() {
    return `/${faker.lorem.word()}/${faker.lorem.word()}.png`;
  }
}

import { faker } from '@faker-js/faker';
import { DeepRequired } from 'libs/common';
import { ISeedHelper } from 'libs/testing';
import { ReviewInput } from 'libs/testing/seed/review/type/review.input';
import { ReviewOutput } from 'libs/testing/seed/review/type/review.output';

/**
 * @author jochongs
 */
export class ReviewSeedHelper extends ISeedHelper<ReviewInput, ReviewOutput> {
  public async seed(input: ReviewInput): Promise<ReviewOutput> {
    const filledInput = await this.getFilledInputValue(input);

    const review = await this.prisma.review.create({
      include: {
        ReviewImg: true,
      },
      data: {
        userIdx: filledInput.userIdx,
        cultureContentIdx: filledInput.contentIdx,
        starRating: filledInput.starRating,
        ReviewImg: {
          createMany: {
            data: filledInput.imgList.map((imgPath) => ({ imgPath })),
          },
        },
        reportCount: filledInput.reportCount,
        likeCount: filledInput.likeCount,
        description: filledInput.description,
        visitTime: filledInput.visitTime,
        deletedAt: filledInput.deletedAt,
        firstReportedAt: filledInput.firstReportedAt,
      },
    });

    return {
      idx: review.idx,
      userIdx: review.userIdx,
      starRating: review.starRating,
      contentIdx: review.cultureContentIdx,
      imgList: review.ReviewImg.map((img) => img.imgPath),
      reportCount: review.reportCount,
      likeCount: review.likeCount,
      description: review.description,
      visitTime: review.visitTime,
      deletedAt: review.deletedAt,
      firstReportedAt: review.firstReportedAt,
    };
  }

  private async getFilledInputValue(
    input: ReviewInput,
  ): Promise<DeepRequired<ReviewInput>> {
    return {
      userIdx: input.userIdx,
      contentIdx: input.contentIdx,
      starRating: input.starRating ?? this.getRandomStarRating(),
      imgList: input.imgList ?? this.getRandomImgList(),
      reportCount: input.reportCount ?? 0,
      likeCount: input.likeCount ?? 0,
      description: input.description ?? faker.lorem.sentences(4),
      visitTime: input.visitTime ?? this.getRandomVisitDate(),
      deletedAt: input.deletedAt ?? null,
      firstReportedAt: input.firstReportedAt ?? null,
    };
  }

  private getRandomImgList(): string[] {
    const randomImgCount = Math.floor(Math.random() * 9) + 1; // 1 ~ 10

    return Array.from({ length: randomImgCount }).map(
      () => `/review/${faker.lorem.word()}.png`,
    );
  }

  private getRandomVisitDate(): Date {
    const oneYearAgo = new Date();

    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return faker.date.between({ from: oneYearAgo, to: new Date() });
  }

  private getRandomStarRating(): number {
    return faker.number.int({ min: 1, max: 5 });
  }
}

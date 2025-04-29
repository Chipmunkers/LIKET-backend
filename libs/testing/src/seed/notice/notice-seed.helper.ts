import { faker } from '@faker-js/faker';
import { DeepRequired } from 'libs/common';
import { ISeedHelper } from 'libs/testing/interface/seed-helper.interface';
import { NoticeInput } from 'libs/testing/seed/notice/type/notice.input';
import { NoticeOutput } from 'libs/testing/seed/notice/type/notice.output';

/**
 * @author jochongs
 */
export class NoticeSeedHelper extends ISeedHelper<NoticeInput, NoticeOutput> {
  public async seed(input: NoticeInput): Promise<NoticeOutput> {
    const filledValue = this.getFilledValue(input);

    const createdNotice = await this.prisma.notice.create({
      data: {
        title: filledValue.title,
        contents: filledValue.contents,
        activatedAt: filledValue.activatedAt,
        deletedAt: filledValue.deletedAt,
        pinnedAt: filledValue.pinnedAt,
      },
    });

    return {
      idx: createdNotice.idx,
      title: createdNotice.title,
      contents: createdNotice.contents,
      activatedAt: createdNotice.activatedAt,
      deletedAt: createdNotice.deletedAt,
      pinnedAt: createdNotice.pinnedAt,
    };
  }

  private getFilledValue(input: NoticeInput): DeepRequired<NoticeInput> {
    return {
      title: input.title ?? faker.word.words(3),
      contents: input.title ?? faker.lorem.sentences(3),
      activatedAt: input.activatedAt ?? null,
      deletedAt: input.deletedAt ?? null,
      pinnedAt: input.pinnedAt ?? null,
    };
  }
}

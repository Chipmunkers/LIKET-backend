import { DeepRequired, getRandomValueFromConstant } from 'libs/common';
import {
  REVIEW_REPORT_TYPE,
  ReviewReportType,
} from 'libs/core/review/constant/review-report-type';
import { ISeedHelper } from 'libs/testing/interface/seed-helper.interface';
import { ReviewReportInput } from 'libs/testing/seed/review-report/type/review-report.input';
import { ReviewReportOutput } from 'libs/testing/seed/review-report/type/review-report.output';

/**
 * @author jochongs
 */
export class ReviewReportSeedHelper extends ISeedHelper<
  ReviewReportInput,
  ReviewReportOutput
> {
  public async seed(input: ReviewReportInput): Promise<ReviewReportOutput> {
    const filledInput = await this.getFilledInputValue(input);

    const report = await this.prisma.reviewReport.create({
      data: {
        reportUserIdx: filledInput.userIdx,
        reviewIdx: filledInput.reviewIdx,
        typeIdx: filledInput.typeIdx,
        deletedAt: filledInput.deletedAt,
      },
    });

    return {
      userIdx: report.reportUserIdx,
      reviewIdx: report.reviewIdx,
      typeIdx: report.typeIdx as ReviewReportType,
      deletedAt: report.deletedAt,
    };
  }

  private async getFilledInputValue(
    input: ReviewReportInput,
  ): Promise<DeepRequired<ReviewReportInput>> {
    return {
      reviewIdx: input.reviewIdx,
      userIdx: input.userIdx,
      deletedAt: input.deletedAt ?? null,
      typeIdx: input.typeIdx ?? this.getRandomTypeIdx(),
    };
  }

  private getRandomTypeIdx() {
    return getRandomValueFromConstant(REVIEW_REPORT_TYPE);
  }
}
